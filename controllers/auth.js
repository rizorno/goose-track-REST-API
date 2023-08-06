const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const gravatar = require("gravatar");

const { nanoid } = require("nanoid");

const { ctrlWrapper } = require("../utils");

const { User } = require("../models/user");

const { Review } = require("../models/review");

const { HttpError, sendEmail } = require("../helpers");

const { SECRET_KEY, SECRET_REFRESH_KEY, BASE_URL } = process.env;

// ? register

const register = async (req, res) => {
  // eslint-disable-next-line no-unused-vars
  const { name, email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = `${gravatar.url(email)}?s=1000&d=mp`; // size = 1000 pixels, mp = mystery person,
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Goose Track. Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  const passwordCompare = await bcrypt.compare(password, newUser.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = { id: newUser._id };
  const expires = 1000 * 60 * 60 * 1 * 1; // 1h in ms // milliseconds * seconds * minutes * hours * days
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: `${expires}ms` });
  const refreshToken = jwt.sign(payload, SECRET_REFRESH_KEY, {
    expiresIn: "2h",
  });
  const refreshTime = new Date().getTime() + expires;

  await User.findByIdAndUpdate(newUser._id, {
    token,
    refreshToken,
    refreshTime,
  });

  res.status(201).json({
    token,
    refreshToken,
    refreshTime,
    user: { name: newUser.name, email: newUser.email },
  });
};

// ? verify email

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.json({ message: "Verification successful" });
};

// ? resend email

const resendEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw HttpError(400, "Missing required field email");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404, "Email not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Goose Track. Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verification email sent",
  });
};

// ? login

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verify");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = { id: user._id };
  const expires = 1000 * 60 * 60 * 1 * 1; // 1h in ms // milliseconds * seconds * minutes * hours * days
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: `${expires}ms` });
  const refreshToken = jwt.sign(payload, SECRET_REFRESH_KEY, {
    expiresIn: "3d",
  });
  const refreshTime = new Date().getTime() + expires;

  await User.findByIdAndUpdate(user._id, {
    token,
    refreshToken,
    refreshTime,
  });

  res.json({
    token,
    refreshToken,
    refreshTime,
    user: { name: user.name, email: user.email },
  });
};

// ? logout

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, {
    token: "",
    refreshToken: "",
    refreshTime: null,
  });

  res.status(204).json();
};

// ? refresh Token

const refreshToken = async (req, res) => {
  const { _id } = req.user;
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw HttpError(401, "RefreshToken is required!");
  }

  const payload = { id: _id };
  const expires = 1000 * 60 * 60 * 1 * 1; // 1h in ms // milliseconds * seconds * minutes * hours * days
  const newToken = jwt.sign(payload, SECRET_KEY, { expiresIn: `${expires}ms` });
  const newRefreshToken = jwt.sign(payload, SECRET_REFRESH_KEY, {
    expiresIn: "3d",
  });
  const newRefreshTime = new Date().getTime() + expires;

  await User.findByIdAndUpdate(_id, {
    token: newToken,
    refreshToken: newRefreshToken,
    refreshTime: newRefreshTime,
  });

  res.json({
    token: newToken,
    refreshToken: newRefreshToken,
    refreshTime: newRefreshTime,
  });
};

// ? current User

const getCurrentUser = async (req, res) => {
  const { name, email, birthday, phone, skype, avatarURL, review } = req.user;

  res.json({ name, email, birthday, phone, skype, avatarURL, review });
};

// ? update User

const updateUser = async (req, res) => {
  const { _id } = req.user;

  const result = await User.findByIdAndUpdate(_id, req.body, { new: true });

  if (!result) {
    throw HttpError(404);
  }

  const { name, email, birthday, phone, skype, avatarURL } = result;

  res.json({ user: { name, email, birthday, phone, skype, avatarURL } });
};

// ? delete User

const deleteUser = async (req, res) => {
  const { _id, email } = req.user;

  const result = await User.findByIdAndDelete(_id);

  const myReview = await Review.findOne({ email });

  await Review.findByIdAndDelete(myReview._id);

  if (!result) {
    throw HttpError(404);
  }

  res.json({ message: "Account deleted" });
};

module.exports = {
  register: ctrlWrapper(register),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendEmail: ctrlWrapper(resendEmail),
  login: ctrlWrapper(login),
  refreshToken: ctrlWrapper(refreshToken),
  logout: ctrlWrapper(logout),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  updateUser: ctrlWrapper(updateUser),
  deleteUser: ctrlWrapper(deleteUser),
};

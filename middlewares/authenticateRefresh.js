const jwt = require("jsonwebtoken");

const { TokenExpiredError } = jwt;

const { HttpError } = require("../helpers");

const { User } = require("../models/user");

const { SECRET_KEY, SECRET_REFRESH_KEY } = process.env;

const authenticateRefresh = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token, refreshToken] = authorization.split(" ");

  if (bearer !== "Bearer") {
    next(HttpError(401));
  }

  try {
    const refresh = jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (decoded) {
        return decoded;
      }
      if (err instanceof TokenExpiredError) {
        return "expired";
      }
    });

    if (refresh === "expired") {
      const { id } = jwt.verify(
        refreshToken,
        SECRET_REFRESH_KEY,
        (err, decoded) => {
          if (err instanceof TokenExpiredError) {
            return next(HttpError(401, "RefreshToken expired"));
          }
          return decoded;
        }
      );

      const user = await User.findById(id);

      if (!user) {
        next(HttpError(401, "RefreshToken is wrong"));
      }
      req.user = user;
      req.body = { refreshToken: user.refreshToken };
      next();
    } else if (refresh !== "expired") {
      const user = await User.findById(refresh.id);

      if (!user) {
        next(HttpError(401, "Token is wrong"));
      }

      res.json({
        token: user.token,
        refreshToken: user.refreshToken,
        refreshTime: user.refreshTime,
      });
    }
  } catch (error) {
    next(HttpError(401));
  }
};

module.exports = authenticateRefresh;

const { ctrlWrapper } = require("../utils");

const { Review } = require("../models/review");

const { User } = require("../models/user");

// ? get all reviews

const getAll = async (req, res) => {
  const result = await Review.find();

  res.json(result);
};

// ? add review

const add = async (req, res) => {
  const { _id } = req.user;

  const result = await Review.create(req.body);

  await User.findByIdAndUpdate(_id, {
    review: true,
  });

  const { review } = await User.findOne({ _id });

  res.status(201).json({ result, review });
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  add: ctrlWrapper(add),
};

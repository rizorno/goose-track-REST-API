const { Schema, model } = require("mongoose");

const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const reviewSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
      default: 0,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

reviewSchema.post("save", handleMongooseError);

const addSchema = Joi.object({
  email: Joi.string().required(),
  name: Joi.string().min(3).max(250).required().messages({
    "any.required": "Missing required name field",
  }),
  avatar: Joi.string(),
  rating: Joi.number().min(0).max(5),
  text: Joi.string().required().messages({
    "any.required": "Missing required text review field",
  }),
});

const schemas = {
  addSchema,
};

const Review = model("review", reviewSchema);

module.exports = {
  Review,
  schemas,
};

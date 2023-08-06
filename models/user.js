const { Schema, model } = require("mongoose");

const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

// eslint-disable-next-line no-useless-escape
const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      match: emailRegexp,
      unique: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, "Set password for user"],
    },
    birthday: {
      type: Date,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    skype: {
      type: String,
      default: "",
    },
    avatarURL: {
      type: String,
      required: true,
    },
    review: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: "",
    },
    refreshToken: {
      type: String,
      default: "",
    },
    refreshTime: {
      type: Number,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(250).required().messages({
    "any.required": "Missing required name field",
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": "Missing required email field",
  }),
  password: Joi.string().min(6).required().messages({
    "any.required": "Missing required password field",
  }),
});

const verifySchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": "Missing required email field",
  }),
  password: Joi.string().min(6).required().messages({
    "any.required": "Missing required password field",
  }),
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    "any.required": "Missing required refreshToken field",
  }),
});

const schemas = {
  registerSchema,
  verifySchema,
  loginSchema,
  refreshSchema,
};

const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
};

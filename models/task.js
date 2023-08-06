const { Schema, model } = require("mongoose");

const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Set title for task"],
    },
    status: {
      type: String,
      enum: ["toDo", "inProgress", "done"],
      default: "toDo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    date: {
      start: {
        type: String,
        required: [true, "Set the task start date"],
      },
      end: {
        type: String,
        required: [true, "Set the task end date"],
      },
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

taskSchema.post("save", handleMongooseError);

const addSchema = Joi.object({
  title: Joi.string().min(3).max(250).required().messages({
    "any.required": "Missing required title field",
  }),
  status: Joi.string().required().messages({
    "any.required": "Missing required status field",
  }),
  priority: Joi.string().required().messages({
    "any.required": "Missing required priority field",
  }),
  date: {
    start: Joi.string().required().messages({
      "any.required": "Missing required start date field",
    }),
    end: Joi.string().required().messages({
      "any.required": "Missing required end date field",
    }),
  },
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid("toDo", "inProgress", "done").required(),
});

const updatePrioritySchema = Joi.object({
  priority: Joi.string().valid("low", "medium", "high").required(),
});

const filterSchema = Joi.object({
  title: Joi.string(),
  status: Joi.array().items(Joi.string().valid("toDo", "inProgress", "done")),
  priority: Joi.array().items(Joi.string().valid("low", "medium", "high")),
  start: Joi.array().items(
    Joi.string().valid("morning", "afternoon", "evening", "night")
  ),
  end: Joi.array().items(
    Joi.string().valid("morning", "afternoon", "evening", "night")
  ),
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

const schemas = {
  addSchema,
  updateStatusSchema,
  updatePrioritySchema,
  filterSchema,
};

const Task = model("task", taskSchema);

module.exports = {
  Task,
  schemas,
};

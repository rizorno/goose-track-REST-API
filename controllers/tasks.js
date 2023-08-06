const { ctrlWrapper } = require("../utils");

const { Task } = require("../models/task");

const { HttpError } = require("../helpers");

// ? get all own tasks

const getAll = async (req, res) => {
  const { _id: owner } = req.user;

  const result = await Task.find({ owner }, "-createdAt -updatedAt").populate(
    "owner",
    "name email"
  );

  res.json(result);
};

// ? get the task by ID

const getById = async (req, res) => {
  const { id } = req.params;

  const result = await Task.findById(id);

  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
};

// ? add the task

const add = async (req, res) => {
  const { _id: owner } = req.user;

  const result = await Task.create({
    ...req.body,
    owner,
  });

  res.status(201).json(result);
};

// ? delete the task by ID

const deleteById = async (req, res) => {
  const { id } = req.params;

  const result = await Task.findByIdAndDelete(id);

  if (!result) {
    throw HttpError(404);
  }

  res.json({ message: "Task deleted" });
};

// ? delete all tasks of the owner

const deleteMany = async (req, res) => {
  const { _id } = req.user;

  const result = await Task.deleteMany({ owner: _id });

  if (!result) {
    throw HttpError(404);
  }

  res.json({ message: "Tasks deleted" });
};

// ? update the task by ID

const updateById = async (req, res) => {
  const { id } = req.params;

  const result = await Task.findByIdAndUpdate(id, req.body, { new: true });

  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
};

// ? update task status by ID

const updateByIdStatus = async (req, res) => {
  const { id } = req.params;

  const result = await Task.findByIdAndUpdate(id, req.body, { new: true });

  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
};

// ? update task priority by ID

const updateByIdPriority = async (req, res) => {
  const { id } = req.params;

  const result = await Task.findByIdAndUpdate(id, req.body, { new: true });

  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
};

// ? tasks filters

const filterTasks = async (req, res) => {
  const { _id } = req.user;
  const obj = req.body;
  obj.owner = _id;

  // eslint-disable-next-line array-callback-return
  const startArr = obj.start.map((element) => {
    // dddd-dd-ddT06:00:00.000Z - dddd-dd-ddT11:59:59.000Z

    if (element === "morning") {
      const result =
        /^(\d{4})-(\d{2})-(\d{2})T(0[6-9]|1[0-1]):([0-5]\d):([0-5]\d)\.(0{3})Z$/;
      return result;
    }

    // dddd-dd-ddT12:00:00.000Z - dddd-dd-ddT17:59:59.000Z

    if (element === "afternoon") {
      const result =
        /^(\d{4})-(\d{2})-(\d{2})T(1[2-7]):([0-5]\d):([0-5]\d)\.(0{3})Z$/;
      return result;
    }

    // dddd-dd-ddT18:00:00.000Z - dddd-dd-ddT23:59:59.000Z

    if (element === "evening") {
      const result =
        /^(\d{4})-(\d{2})-(\d{2})T(1[8-9]|2[0-3]):([0-5]\d):([0-5]\d)\.(0{3})Z$/;
      return result;
    }

    // dddd-dd-ddT00:00:00.000Z - dddd-dd-ddT05:59:59.000Z

    if (element === "night") {
      const result =
        /^(\d{4})-(\d{2})-(\d{2})T(0[0-5]):([0-5]\d):([0-5]\d)\.(0{3})Z$/;
      return result;
    }
  });

  // eslint-disable-next-line array-callback-return
  const endArr = obj.end.map((element) => {
    // dddd-dd-ddT06:00:00.000Z - dddd-dd-ddT11:59:59.000Z

    if (element === "morning") {
      const result =
        /^(\d{4})-(\d{2})-(\d{2})T(0[6-9]|1[0-1]):([0-5]\d):([0-5]\d)\.(0{3})Z$/;
      return result;
    }

    // dddd-dd-ddT12:00:00.000Z - dddd-dd-ddT17:59:59.000Z

    if (element === "afternoon") {
      const result =
        /^(\d{4})-(\d{2})-(\d{2})T(1[2-7]):([0-5]\d):([0-5]\d)\.(0{3})Z$/;
      return result;
    }

    // dddd-dd-ddT18:00:00.000Z - dddd-dd-ddT23:59:59.000Z

    if (element === "evening") {
      const result =
        /^(\d{4})-(\d{2})-(\d{2})T(1[8-9]|2[0-3]):([0-5]\d):([0-5]\d)\.(0{3})Z$/;
      return result;
    }

    // dddd-dd-ddT00:00:00.000Z - dddd-dd-ddT05:59:59.000Z

    if (element === "night") {
      const result =
        /^(\d{4})-(\d{2})-(\d{2})T(0[0-5]):([0-5]\d):([0-5]\d)\.(0{3})Z$/;
      return result;
    }
  });

  const options = () => {
    if (
      obj.status.length === 0 &&
      obj.priority.length === 0 &&
      obj.start.length === 0 &&
      obj.end.length === 0
    ) {
      const result = {
        status: { $in: ["toDo", "inProgress", "done"] },
        priority: { $in: ["low", "medium", "high"] },
        owner: _id,
      };
      return result;
    } else if (
      obj.status.length > 0 &&
      obj.priority.length === 0 &&
      obj.start.length === 0 &&
      obj.end.length === 0
    ) {
      const result = {
        status: { $in: obj.status },
        owner: _id,
      };
      return result;
    } else if (
      obj.status.length === 0 &&
      obj.priority.length > 0 &&
      obj.start.length === 0 &&
      obj.end.length === 0
    ) {
      const result = {
        priority: { $in: obj.priority },
        owner: _id,
      };
      return result;
    } else if (
      obj.status.length === 0 &&
      obj.priority.length === 0 &&
      obj.start.length > 0 &&
      obj.end.length === 0
    ) {
      const result = {
        "date.start": { $in: startArr },
        owner: _id,
      };
      return result;
    } else if (
      obj.status.length === 0 &&
      obj.priority.length === 0 &&
      obj.start.length === 0 &&
      obj.end.length > 0
    ) {
      const result = {
        "date.end": { $in: endArr },
        owner: _id,
      };
      return result;
    } else if (
      obj.status.length > 0 &&
      obj.priority.length > 0 &&
      obj.start.length === 0 &&
      obj.end.length === 0
    ) {
      const result = {
        status: { $in: obj.status },
        priority: { $in: obj.priority },
        owner: _id,
      };
      return result;
    } else if (
      obj.status.length > 0 &&
      obj.priority.length === 0 &&
      obj.start.length > 0 &&
      obj.end.length === 0
    ) {
      const result = {
        status: { $in: obj.status },
        "date.start": { $in: startArr },
        owner: _id,
      };
      return result;
    } else if (
      obj.status.length > 0 &&
      obj.priority.length === 0 &&
      obj.start.length === 0 &&
      obj.end.length > 0
    ) {
      const result = {
        status: { $in: obj.status },
        "date.end": { $in: endArr },
        owner: _id,
      };
      return result;
    } else if (
      obj.status.length === 0 &&
      obj.priority.length > 0 &&
      obj.start.length > 0 &&
      obj.end.length === 0
    ) {
      const result = {
        priority: { $in: obj.priority },
        "date.start": { $in: startArr },
        owner: _id,
      };
      return result;
    } else if (
      obj.status.length === 0 &&
      obj.priority.length > 0 &&
      obj.start.length === 0 &&
      obj.end.length > 0
    ) {
      const result = {
        priority: { $in: obj.priority },
        "date.end": { $in: endArr },
        owner: _id,
      };
      return result;
    } else if (
      obj.status.length === 0 &&
      obj.priority.length === 0 &&
      obj.start.length > 0 &&
      obj.end.length > 0
    ) {
      const result = {
        "date.start": { $in: startArr },
        "date.end": { $in: endArr },
        owner: _id,
      };
      return result;
    } else if (
      obj.status.length > 0 &&
      obj.priority.length > 0 &&
      obj.start.length > 0 &&
      obj.end.length === 0
    ) {
      const result = {
        status: { $in: obj.status },
        priority: { $in: obj.priority },
        "date.start": { $in: startArr },
        owner: _id,
      };
      return result;
    } else if (
      obj.status.length === 0 &&
      obj.priority.length > 0 &&
      obj.start.length > 0 &&
      obj.end.length > 0
    ) {
      const result = {
        priority: { $in: obj.priority },
        "date.start": { $in: startArr },
        "date.end": { $in: endArr },
        owner: _id,
      };
      return result;
    } else if (
      obj.status.length > 0 &&
      obj.priority.length === 0 &&
      obj.start.length > 0 &&
      obj.end.length > 0
    ) {
      const result = {
        status: { $in: obj.status },
        "date.start": { $in: startArr },
        "date.end": { $in: endArr },
        owner: _id,
      };
      return result;
    } else if (
      obj.status.length > 0 &&
      obj.priority.length > 0 &&
      obj.start.length === 0 &&
      obj.end.length > 0
    ) {
      const result = {
        status: { $in: obj.status },
        priority: { $in: obj.priority },
        "date.end": { $in: endArr },
        owner: _id,
      };
      return result;
    } else if (
      obj.status.length > 0 &&
      obj.priority.length > 0 &&
      obj.start.length > 0 &&
      obj.end.length > 0
    ) {
      const result = {
        status: { $in: obj.status },
        priority: { $in: obj.priority },
        "date.start": { $in: startArr },
        "date.end": { $in: endArr },
        owner: _id,
      };
      return result;
    }
  };

  let result;
  if (obj.title === " ") {
    result = await Task.find(options());
  } else {
    result = await Task.find({ title: { $regex: `(?i)${obj.title}` } });
  }

  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  deleteById: ctrlWrapper(deleteById),
  deleteMany: ctrlWrapper(deleteMany),
  updateById: ctrlWrapper(updateById),
  updateByIdStatus: ctrlWrapper(updateByIdStatus),
  updateByIdPriority: ctrlWrapper(updateByIdPriority),
  filterTasks: ctrlWrapper(filterTasks),
};

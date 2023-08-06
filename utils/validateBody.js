const { HttpError } = require("../helpers");

const validateBody = (schema) => {
  // eslint-disable-next-line no-unused-vars
  const func = async (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(HttpError(400, error.message));
    }
    next();
  };
  return func;
};

module.exports = validateBody;

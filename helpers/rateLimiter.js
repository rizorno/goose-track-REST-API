const rateLimit = require("express-rate-limit");

const registerLimit = rateLimit({
  windowMs: 1000 * 60 * 60 * 1 * 1, // 1h in ms // milliseconds * seconds * minutes * hours * days
  max: 3,
  handler: (req, res, next) => {
    return res.status(403).json({
      message:
        "Too many attempts to register. Not more than three times per hour from one IP.",
    });
  },
});

const reguestLimit = rateLimit({
  windowMs: 1000 * 60 * 60 * 1 * 1, // 1h in ms // milliseconds * seconds * minutes * hours * days
  max: 500,
  handler: (_req, res, _next) => {
    return res.status(403).json({
      message: "Too many requests, please try again later.",
    });
  },
});

module.exports = { registerLimit, reguestLimit };

const express = require("express");

const router = express.Router();

const ctrl = require("../../controllers/reviews");

const { validateBody } = require("../../utils");

const { authenticate } = require("../../middlewares");

const { schemas } = require("../../models/review");

router.get("/", ctrl.getAll);

router.post("/", authenticate, validateBody(schemas.addSchema), ctrl.add);

module.exports = router;

const express = require("express");

const router = express.Router();

const ctrl = require("../../controllers/tasks");

const { validateBody } = require("../../utils");

const { authenticate, isValidId } = require("../../middlewares");

const { schemas } = require("../../models/task");

router.get("/", authenticate, ctrl.getAll);

router.get("/:id", authenticate, isValidId, ctrl.getById);

router.post("/", authenticate, validateBody(schemas.addSchema), ctrl.add);

router.delete("/:id", authenticate, isValidId, ctrl.deleteById);

router.delete("/", authenticate, ctrl.deleteMany);

router.put(
  "/:id",
  authenticate,
  isValidId,
  validateBody(schemas.addSchema),
  ctrl.updateById
);

router.patch(
  "/:id/status",
  authenticate,
  isValidId,
  validateBody(schemas.updateStatusSchema),
  ctrl.updateByIdStatus
);

router.patch(
  "/:id/priority",
  authenticate,
  isValidId,
  validateBody(schemas.updatePrioritySchema),
  ctrl.updateByIdPriority
);

router.post(
  "/filter",
  authenticate,
  validateBody(schemas.filterSchema),
  ctrl.filterTasks
);

module.exports = router;

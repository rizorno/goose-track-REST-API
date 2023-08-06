const express = require("express");

const { validateBody } = require("../../utils");

const {
  authenticate,
  authenticateRefresh,
  upload,
} = require("../../middlewares");

const { schemas } = require("../../models/user");

const ctrl = require("../../controllers/auth");

const router = express.Router();

const { registerLimit } = require("../../helpers/rateLimiter");

router.post(
  "/register",
  registerLimit,
  validateBody(schemas.registerSchema),
  ctrl.register
);

router.get("/verify/:verificationToken", ctrl.verifyEmail);

router.post("/verify", validateBody(schemas.verifySchema), ctrl.resendEmail);

router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.post(
  "/refresh",
  authenticateRefresh,
  validateBody(schemas.refreshSchema),
  ctrl.refreshToken
);

router.get("/current", authenticate, ctrl.getCurrentUser);

router.post("/logout", authenticate, ctrl.logout);

router.put("/", authenticate, ctrl.updateUser);

router.patch("/avatar", authenticate, upload);

router.delete("/", authenticate, ctrl.deleteUser);

module.exports = router;

import express from "express";
import authController from "../../controllers/auth-controller.js";
import { upload, authenticate, isEmptyBody } from "../../middlewares/index.js";
import { validateBody } from "../../decorators/index.js";
import {
  userSignupSchema,
  userSigninSchema,
  userUpdateSubscriptionSchema, userEmailSchema,
} from "../../models/User.js";

const userSignupValidate = validateBody(userSignupSchema);
const userSigninValidate = validateBody(userSigninSchema);
const userEmailValidate = validateBody(userEmailSchema);

const userUpdateSubscriptionValidate = validateBody(
  userUpdateSubscriptionSchema
);

const authRouter = express.Router();

authRouter.post(
  "/signup",
  upload.single("avatarUrl"),
  isEmptyBody,
  userSignupValidate,
  authController.signup
);

authRouter.get("/verify/:verificationToken", authController.verify);

authRouter.post("/verify", isEmptyBody,
  userEmailValidate,
  authController.resendVerifyEmail);

authRouter.post(
  "/signin",
  isEmptyBody,
  userSigninValidate,
  authController.signin
);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/signout", authenticate, authController.signout);

authRouter.patch(
  "/subscription",
  authenticate,
  userUpdateSubscriptionValidate,
  authController.subscriptionUpdate
);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatarUrl"),
  authController.updateAvatar
);

export default authRouter;
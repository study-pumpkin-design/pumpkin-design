import { Router } from "express";
import authController from "../controller/auth.controller";

const authRouter = Router();

authRouter.post("/sign-up", authController.userSignup);
authRouter.post("/login", authController.userLogin);
authRouter.post("/admin-login", authController.adminLogin);
authRouter.post(
  "/initiate-reset-password",
  authController.initiateResetPassword,
);
authRouter.post("/verify-reset-password", authController.verifyResetPassword);
authRouter.post("/update-password", authController.resetPassword);

export default authRouter;

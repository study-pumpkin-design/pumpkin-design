import { Router } from "express";
import authController from "../controller/auth.controller";

const authRouter = Router();

authRouter.post("/sign-up", authController.userSignup);
authRouter.post("/login", authController.userLogin);
authRouter.post("/admin-login", authController.adminLogin);

export default authRouter;

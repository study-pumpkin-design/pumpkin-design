import { Router } from "express";
import userController from "../controller/user.controller";

const userRouter = Router();

userRouter.post("/start-verification", userController.startVerification);
userRouter.post("/complete-verification", userController.completeVerification);

export default userRouter;

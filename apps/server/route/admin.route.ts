import { Router } from "express";
import adminController from "../controller/admin.controller";
import authMiddleware from "../middleware/auth.middleware";

const adminRouter = Router();
adminRouter.use(authMiddleware);

adminRouter.post("/create-admin", adminController.createAdmin);

export default adminRouter;

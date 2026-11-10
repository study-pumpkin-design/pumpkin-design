import { Router } from "express";
import adminController from "../controller/admin.controller";
import authMiddleware from "../middleware/auth.middleware";
import isAdmin from "../middleware/admin.middleware";

const adminRouter = Router();
adminRouter.use(authMiddleware);

adminRouter.get("/me", isAdmin, adminController.getCurrentAdmin);
adminRouter.post("/create-admin", adminController.createAdmin);

export default adminRouter;

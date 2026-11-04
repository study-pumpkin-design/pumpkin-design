import { Router } from "express";
import adminController from "../controller/admin.controller";

const adminRouter = Router();
adminRouter.post("/create-admin", adminController.createAdmin);

export default adminRouter;

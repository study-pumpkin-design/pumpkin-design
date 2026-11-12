import { Router } from "express";
import multer from "multer";
import authMiddleware from "../middleware/auth.middleware";
import isAdmin from "../middleware/admin.middleware";
import mediaAssetController from "../controller/media-asset.controller";

const mediaAssetRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 250 * 1024 * 1024 } });

mediaAssetRouter.post("/upload", authMiddleware, isAdmin, upload.single("file"), mediaAssetController.upload.bind(mediaAssetController));

export default mediaAssetRouter;

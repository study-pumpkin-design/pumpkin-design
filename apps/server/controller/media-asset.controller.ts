import type { Request, Response } from "express";
import mediaAssetService, { type MediaUploadKind } from "../service/media-asset.service";

class MediaAssetController {
  async upload(req: Request, res: Response) {
    try {
      const kind = req.body.kind as MediaUploadKind;
      if (!req.file || !["attachment", "video", "thumbnail"].includes(kind)) throw new Error("INCORRECT_INPUT_DATA");
      const asset = await mediaAssetService.upload(req.file, kind);
      return res.status(201).json({ data: asset, message: "Asset uploaded successfully", statusCode: 201 });
    } catch (error: any) {
      const knownError = ["FILE_REQUIRED", "INVALID_VIDEO_FILE", "INVALID_THUMBNAIL_FILE", "INCORRECT_INPUT_DATA"].includes(error.message);
      return res.status(knownError ? 400 : 500).json({ data: null, message: knownError ? "Choose a valid file for this upload." : "We couldn’t upload this asset.", statusCode: knownError ? 400 : 500 });
    }
  }
}

const mediaAssetController = new MediaAssetController();
export default mediaAssetController;

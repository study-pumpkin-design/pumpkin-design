import { uploadTypes } from "@sd/types";
import MediaService from "./media.service";
import mediaAssetRepository from "../repository/media-asset.repository";

export type MediaUploadKind = "attachment" | "video" | "thumbnail";

class MediaAssetService {
  async upload(file: Express.Multer.File, kind: MediaUploadKind) {
    this.validateFile(file, kind);
    const mediaService = new MediaService();
    const uploaded = await mediaService.uploadAsset({
      file,
      folder: `course-content/${kind}s`,
      contentType: file.mimetype,
    });
    const asset = await mediaAssetRepository.create({
      assetId: uploaded.assetId,
      storage_medium:
        uploaded.provider === uploadTypes.StorageProvider.AWS_S3
          ? "AWS"
          : "CLOUDINARY",
      original_name: uploaded.originalName,
      mime_type: uploaded.mimeType,
    });

    return { ...asset, url: uploaded.url };
  }

  private validateFile(file: Express.Multer.File, kind: MediaUploadKind) {
    if (!file) throw new Error("FILE_REQUIRED");
    if (kind === "video" && !file.mimetype.startsWith("video/"))
      throw new Error("INVALID_VIDEO_FILE");
    if (kind === "thumbnail" && !file.mimetype.startsWith("image/"))
      throw new Error("INVALID_THUMBNAIL_FILE");
  }
}

const mediaAssetService = new MediaAssetService();
export default mediaAssetService;

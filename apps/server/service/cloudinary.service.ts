import { v2 as cloudinary } from "cloudinary";
import { uploadTypes } from "@sd/types";

class CloudinaryProvider implements uploadTypes.IMediaFactory {
  private getResourceType(mimeType: string): "image" | "video" | "raw" {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/") || mimeType.startsWith("audio/"))
      return "video";

    return "raw";
  }

  private parseAssetId(assetId: string) {
    const separatorIndex = assetId.indexOf(":");

    if (separatorIndex === -1) {
      throw new Error("Invalid Cloudinary asset ID");
    }

    return {
      resource_type: assetId.substring(0, separatorIndex) as
        "image" | "video" | "raw",
      public_id: assetId.substring(separatorIndex + 1),
    };
  }

  async uploadAsset(
    input: uploadTypes.IUploadAsset,
  ): Promise<uploadTypes.IAssetResponse> {
    const { file, folder, fileName } = input;

    if (!file?.buffer) {
      throw new Error("File buffer is required");
    }

    const resourceType = this.getResourceType(
      input.contentType || file.mimetype,
    );

    const publicId = fileName
      ? fileName.replace(/\.[^/.]+$/, "")
      : file.originalname.replace(/\.[^/.]+$/, "");

    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          type: "private",
          folder,
          public_id: publicId,
          overwrite: false,
        },
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve(result);
          else reject(new Error("Cloudinary upload failed"));
        },
      );

      stream.end(file.buffer);
    });

    return {
      assetId: `${result.resource_type}:${result.public_id}`,
      url: result.secure_url,
      provider: uploadTypes.StorageProvider.CLOUDINARY,
      mimeType: file.mimetype,
      originalName: file.originalname,
      size: result.bytes,
    };
  }

  async getSignedURL(assetId: string, expiresIn = 3600): Promise<string> {
    const { resource_type, public_id } = this.parseAssetId(assetId);

    const resource = await cloudinary.api.resource(public_id, {
      resource_type,
      type: "private",
    });

    return cloudinary.utils.private_download_url(public_id, resource.format, {
      resource_type,
      type: "private",
      expires_at: Math.floor(Date.now() / 1000) + expiresIn,
    });
  }

  async deleteAsset(assetId: string): Promise<void> {
    const { resource_type, public_id } = this.parseAssetId(assetId);

    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type,
      type: "private",
      invalidate: true,
    });

    if (result.result !== "ok" && result.result !== "not found") {
      throw new Error(`Cloudinary deletion failed: ${result.result}`);
    }
  }

  async getAssetMetadata(assetId: string): Promise<uploadTypes.IAssetMetadata> {
    const { resource_type, public_id } = this.parseAssetId(assetId);

    const resource = await cloudinary.api.resource(public_id, {
      resource_type,
      type: "private",
    });

    return {
      assetId: `${resource.resource_type}:${resource.public_id}`,
      mimeType: `${resource.resource_type}/${resource.format}`,
      size: resource.bytes,
      originalName: resource.original_filename,
    };
  }
}

export default CloudinaryProvider;

import { uploadTypes } from "@sd/types";
import S3Provider from "./s3.service";
import CloudinaryProvider from "./cloudinary.service";
class MediaService implements uploadTypes.IMediaFactory {
  private provider: uploadTypes.IMediaFactory | null = null;
  constructor(provider: uploadTypes.StorageProvider) {
    switch (provider) {
      case uploadTypes.StorageProvider.AWS_S3:
        this.provider = new S3Provider();
        break;
      case uploadTypes.StorageProvider.CLOUDINARY:
        this.provider = new CloudinaryProvider();
        break;
    }
  }
  async uploadAsset(
    input: uploadTypes.IUploadAsset,
  ): Promise<uploadTypes.IAssetResponse> {
    if (this.provider == null) throw new Error("UNINSTANTIATED_CLASS");
    return await this.provider?.uploadAsset(input);
  }
  async getSignedURL(assetId: string, expiresIn?: number): Promise<string> {
    if (this.provider == null) throw new Error("UNINSTANTIATED_CLASS");
    return await this.provider?.getSignedURL(assetId, expiresIn);
  }
  async deleteAsset(assetId: string): Promise<void> {
    if (this.provider == null) throw new Error("UNINSTANTIATED_CLASS");
    await this.provider?.deleteAsset(assetId);
  }
  async getAssetMetadata(assetId: string): Promise<uploadTypes.IAssetMetadata> {
    if (this.provider == null) throw new Error("UNINSTANTIATED_CLASS");
    return await this.provider.getAssetMetadata(assetId);
  }
}

export default MediaService;

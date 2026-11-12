import { uploadTypes } from "@sd/types";
import S3Provider from "./s3.service";
import CloudinaryProvider from "./cloudinary.service";
class MediaService implements uploadTypes.IMediaFactory {
  private provider: uploadTypes.StorageProvider | null;

  constructor(provider?: uploadTypes.StorageProvider) {
    this.provider = provider ?? null;
  }

  private createProvider(provider: uploadTypes.StorageProvider): uploadTypes.IMediaFactory {
    switch (provider) {
      case uploadTypes.StorageProvider.AWS_S3:
        return new S3Provider();
      case uploadTypes.StorageProvider.CLOUDINARY:
        return new CloudinaryProvider();
    }

    throw new Error("UNINSTANTIATED_CLASS");
  }

  private selectUploadProvider(mimeType: string): uploadTypes.StorageProvider {
    return mimeType.startsWith("image/")
      ? uploadTypes.StorageProvider.CLOUDINARY
      : uploadTypes.StorageProvider.AWS_S3;
  }

  private getConfiguredProvider() {
    if (this.provider == null) throw new Error("UNINSTANTIATED_CLASS");
    return this.createProvider(this.provider);
  }

  async uploadAsset(
    input: uploadTypes.IUploadAsset,
  ): Promise<uploadTypes.IAssetResponse> {
    const provider = this.provider ?? this.selectUploadProvider(input.contentType || input.file.mimetype);
    return this.createProvider(provider).uploadAsset(input);
  }
  async getSignedURL(assetId: string, expiresIn?: number): Promise<string> {
    return this.getConfiguredProvider().getSignedURL(assetId, expiresIn);
  }
  async deleteAsset(assetId: string): Promise<void> {
    await this.getConfiguredProvider().deleteAsset(assetId);
  }
  async getAssetMetadata(assetId: string): Promise<uploadTypes.IAssetMetadata> {
    return this.getConfiguredProvider().getAssetMetadata(assetId);
  }
}

export default MediaService;

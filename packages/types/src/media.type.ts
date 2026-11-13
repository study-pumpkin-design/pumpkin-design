export interface UploadFile {
  buffer: Uint8Array;
  mimetype: string;
  size: number;
  originalname: string;
}

export interface IUploadAsset {
  file: UploadFile;
  folder?: string;
  fileName?: string;
  contentType?: string;
}
export interface IAssetResponse {
  assetId: string;
  url?: string;
  provider: StorageProvider;
  mimeType: string;
  originalName: string;
  size: number;
}
export enum StorageProvider {
  AWS_S3 = "AWS_S3",
  CLOUDINARY = "CLOUDINARY",
}

export interface IAssetMetadata {
  assetId: string;
  mimeType: string;
  size: number;
  originalName: string;
}

export interface IMediaFactory {
  uploadAsset(input: IUploadAsset): Promise<IAssetResponse>;
  getSignedURL(assetId: string, expiresIn?: number): Promise<string>;
  deleteAsset(assetId: string): Promise<void>;
  getAssetMetadata(assetId: string): Promise<IAssetMetadata>;
}

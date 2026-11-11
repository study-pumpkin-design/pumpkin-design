import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { uploadTypes } from "@sd/types";

class S3Provider implements uploadTypes.IMediaFactory {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor() {
    this.bucket = process.env.AWS_S3_BUCKET!;

    this.client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async uploadAsset(
    input: uploadTypes.IUploadAsset,
  ): Promise<uploadTypes.IAssetResponse> {
    const { file, folder, fileName, contentType } = input;

    if (!file?.buffer) {
      throw new Error("File buffer is required");
    }

    const key = `${folder || "uploads"}/${randomUUID()}-${fileName || file.originalname}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: contentType || file.mimetype,
        ContentLength: file.size,
      }),
    );

    return {
      assetId: key,
      provider: uploadTypes.StorageProvider.AWS_S3,
      mimeType: contentType || file.mimetype,
      originalName: file.originalname,
      size: file.size,
    };
  }

  async getSignedURL(assetId: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: assetId,
    });

    return getSignedUrl(this.client as any, command as any, {
      expiresIn,
    });
  }

  async deleteAsset(assetId: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: assetId,
      }),
    );
  }

  async getAssetMetadata(assetId: string): Promise<uploadTypes.IAssetMetadata> {
    const result = await this.client.send(
      new HeadObjectCommand({
        Bucket: this.bucket,
        Key: assetId,
      }),
    );

    return {
      assetId,
      mimeType: result.ContentType || "application/octet-stream",
      size: result.ContentLength || 0,
      originalName:
        result.Metadata?.originalname || assetId.split("/").pop() || assetId,
    };
  }
}

export default S3Provider;

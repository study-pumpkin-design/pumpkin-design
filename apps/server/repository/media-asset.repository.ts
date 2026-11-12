import { db } from "@sd/db";

type CreateMediaAsset = {
  assetId: string;
  storage_medium: "AWS" | "CLOUDINARY";
  original_name: string;
  mime_type: string;
};

class MediaAssetRepository {
  async create(data: CreateMediaAsset) {
    return db.mediaAsset.create({ data });
  }
}

const mediaAssetRepository = new MediaAssetRepository();
export default mediaAssetRepository;

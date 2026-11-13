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

  async findUnusedByIds(ids: string[]) {
    if (!ids.length) return [];
    return db.mediaAsset.findMany({
      where: {
        id: { in: ids },
        moduleAttachments: { none: {} },
        moduleVideos: { none: {} },
        moduleThumbnails: { none: {} },
      },
    });
  }

  async deleteMany(ids: string[]) {
    if (!ids.length) return;
    await db.mediaAsset.deleteMany({ where: { id: { in: ids } } });
  }
}

const mediaAssetRepository = new MediaAssetRepository();
export default mediaAssetRepository;

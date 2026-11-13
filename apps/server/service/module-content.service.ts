import type { courseTypes } from "@sd/types";
import moduleRepository from "../repository/module.repository";
import moduleContentRepository from "../repository/module-content.repository";
import mediaAssetService from "./media-asset.service";

class ModuleContentService {
  async create(data: courseTypes.CreateModuleContentDTO) {
    const module = await moduleRepository.findById(data.module_id);
    if (!module) throw new Error("INVALID_MODULE_ID");
    return moduleContentRepository.create(data);
  }

  async update(id: string, data: courseTypes.UpdateModuleContentDTO) {
    const existing = await this.getById(id);
    const content = await moduleContentRepository.update(id, data);
    await mediaAssetService.deleteUnusedAssets([
      data.attached_media !== undefined &&
      data.attached_media !== existing.attached_media
        ? existing.attached_media
        : null,
      data.video_content !== undefined &&
      data.video_content !== existing.video_content
        ? existing.video_content
        : null,
      data.video_thumbnail !== undefined &&
      data.video_thumbnail !== existing.video_thumbnail
        ? existing.video_thumbnail
        : null,
    ]);
    return content;
  }

  async delete(id: string) {
    const existing = await this.getById(id);
    const content = await moduleContentRepository.delete(id);
    await mediaAssetService.deleteUnusedAssets([
      existing.attached_media,
      existing.video_content,
      existing.video_thumbnail,
    ]);
    return content;
  }

  async getById(id: string) {
    const content = await moduleContentRepository.findById(id);
    if (!content) throw new Error("INVALID_MODULE_CONTENT_ID");
    return content;
  }
}

const moduleContentService = new ModuleContentService();
export default moduleContentService;

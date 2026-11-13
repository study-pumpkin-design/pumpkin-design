import type { courseTypes } from "@sd/types";
import courseRepository from "../repository/course.repository";
import moduleRepository from "../repository/module.repository";
import mediaAssetService from "./media-asset.service";

class ModuleService {
  async create(data: courseTypes.CreateModuleDTO) {
    await courseRepository.getCourse({ id: data.courseId });
    return moduleRepository.create(data);
  }

  async update(id: string, data: courseTypes.UpdateModuleDTO) {
    await this.getById(id);
    return moduleRepository.update(id, data);
  }

  async delete(id: string) {
    const module = await moduleRepository.findWithContents(id);
    if (!module) throw new Error("INVALID_MODULE_ID");
    const deleted = await moduleRepository.delete(id);
    await mediaAssetService.deleteUnusedAssets(
      module.moduleContents.flatMap((content) => [
        content.attached_media,
        content.video_content,
        content.video_thumbnail,
      ]),
    );
    return deleted;
  }

  async getById(id: string) {
    const module = await moduleRepository.findById(id);
    if (!module) throw new Error("INVALID_MODULE_ID");
    return module;
  }
}

const moduleService = new ModuleService();
export default moduleService;

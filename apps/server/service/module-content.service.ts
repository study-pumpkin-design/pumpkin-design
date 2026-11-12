import type { courseTypes } from "@sd/types";
import moduleRepository from "../repository/module.repository";
import moduleContentRepository from "../repository/module-content.repository";

class ModuleContentService {
  async create(data: courseTypes.CreateModuleContentDTO) {
    const module = await moduleRepository.findById(data.module_id);
    if (!module) throw new Error("INVALID_MODULE_ID");
    return moduleContentRepository.create(data);
  }

  async update(id: string, data: courseTypes.UpdateModuleContentDTO) {
    await this.getById(id);
    return moduleContentRepository.update(id, data);
  }

  async delete(id: string) {
    await this.getById(id);
    return moduleContentRepository.delete(id);
  }

  async getById(id: string) {
    const content = await moduleContentRepository.findById(id);
    if (!content) throw new Error("INVALID_MODULE_CONTENT_ID");
    return content;
  }
}

const moduleContentService = new ModuleContentService();
export default moduleContentService;

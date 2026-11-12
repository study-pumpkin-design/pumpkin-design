import type { courseTypes } from "@sd/types";
import courseRepository from "../repository/course.repository";
import moduleRepository from "../repository/module.repository";

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
    await this.getById(id);
    return moduleRepository.delete(id);
  }

  async getById(id: string) {
    const module = await moduleRepository.findById(id);
    if (!module) throw new Error("INVALID_MODULE_ID");
    return module;
  }
}

const moduleService = new ModuleService();
export default moduleService;

import { db } from "@sd/db";
import type { courseTypes } from "@sd/types";

class ModuleContentRepository {
  async create(data: courseTypes.CreateModuleContentDTO) {
    return db.moduleContent.create({ data });
  }

  async findById(id: string) {
    return db.moduleContent.findUnique({ where: { id } });
  }

  async update(id: string, data: courseTypes.UpdateModuleContentDTO) {
    return db.moduleContent.update({ where: { id }, data });
  }

  async delete(id: string) {
    return db.moduleContent.delete({ where: { id } });
  }
}

const moduleContentRepository = new ModuleContentRepository();
export default moduleContentRepository;

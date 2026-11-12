import { db } from "@sd/db";
import type { courseTypes } from "@sd/types";

class ModuleRepository {
  async create(data: courseTypes.CreateModuleDTO) {
    return db.module.create({ data });
  }

  async findById(id: string) {
    return db.module.findUnique({ where: { id } });
  }

  async update(id: string, data: courseTypes.UpdateModuleDTO) {
    return db.module.update({ where: { id }, data });
  }

  async delete(id: string) {
    return db.module.delete({ where: { id } });
  }
}

const moduleRepository = new ModuleRepository();
export default moduleRepository;

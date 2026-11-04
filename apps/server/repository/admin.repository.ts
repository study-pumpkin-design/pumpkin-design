import { db } from "@sd/db";
import type { adminTypes } from "@sd/types";

class AdminRepository {
  async createAdmin(adminData: adminTypes.createAdminDTO & { salt: string }) {
    return db.moderator.create({
      data: adminData,
      select: {
        id: true,
        email: true,
        name: true,
        phone_number: true,
        username: true,
      },
    });
  }
  async getAdmin(userId: string, includeSensitive: boolean = false) {
    const dbAdmin = await db.moderator.findFirst({
      where: {
        email: userId,
      },
    });

    if (dbAdmin != null && !includeSensitive) {
      const { password, salt, ...sanitizedUserObject } = dbAdmin;
      return sanitizedUserObject;
    }
    return dbAdmin;
  }
}
const adminRepository = new AdminRepository();
export default adminRepository;

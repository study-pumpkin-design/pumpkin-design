import { adminTypes } from "@sd/types";
import adminRepository from "../repository/admin.repository";
import { generateSalt, hashPassword } from "../util/password";
class AdminService {
  async createAdminAccount(
    accountData: adminTypes.createAdminDTO,
    creatorId: string,
  ) {
    await this.checkIsAdmin(creatorId);
    const doesAdminExist = await this.checkIsAdmin(accountData.email);
    if (doesAdminExist) {
      throw new Error("DUPLICATE_ADMIN_CREATION");
    }

    const salt = await generateSalt();
    const hashedPassword = await hashPassword(accountData.password, salt);

    await adminRepository.createAdmin({
      ...accountData,
      password: hashedPassword,
      salt,
    });
  }

  async getAdminDetails(adminId: string, includeSensitive: boolean) {
    await this.checkIsAdmin(adminId);
    const dbAdmin = adminRepository.getAdmin(adminId, includeSensitive);
    if (dbAdmin == null) {
      throw new Error("NO_ADMIN_FOUND");
    }
    return dbAdmin;
  }

  private async checkIsAdmin(adminId: string): Promise<boolean> {
    const dbUser = await adminRepository.getAdmin(adminId);
    if (dbUser == null) throw new Error("UNPERMITTED_ACTION_NOT_AN_ADMIN");
    return true;
  }
}
const adminService = new AdminService();
export default adminService;

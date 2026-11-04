import { db } from "@sd/db";
import type { userTypes } from "@sd/types";

class UserRepository {
  async createUser(userDetails: userTypes.createUserDTO & { salt: string }) {
    return db.user.create({
      data: userDetails,
      select: {
        id: true,
        email: true,
        name: true,
        phone_number: true,
        username: true,
      },
    });
  }
  async getUser(userId: string, includeSensitive: boolean = false) {
    const dbUser = await db.user.findFirst({
      where: {
        email: userId,
      },
    });

    if (dbUser != null && !includeSensitive) {
      const { password, salt, ...sanitizedUserObject } = dbUser;
      return sanitizedUserObject;
    }
    return dbUser;
  }
}
const userRepository = new UserRepository();
export default userRepository;

import type { userTypes } from "@sd/types";
import userRepository from "../repository/user.repository";
import { generateSalt, hashPassword } from "../util/password";

class UserService {
  async createUserAccount(accountData: userTypes.createUserDTO) {
    const existingUser = await userRepository.getUser(accountData.email);
    if (existingUser != null) {
      throw new Error("DUPLICATE_USER_CREATION");
    }
    const salt = await generateSalt();
    const hashedPassword = await hashPassword(accountData.password, salt);
    return await userRepository.createUser({
      ...accountData,
      password: hashedPassword,
      salt,
    });
  }
  async getUserDetails(userId: string, includeSensitive: boolean) {
    const dbUser = await userRepository.getUser(userId, includeSensitive);
    if (dbUser == null) {
      throw new Error("NO_USER_FOUND");
    }
    return dbUser;
  }
}
const userService = new UserService();
export default userService;

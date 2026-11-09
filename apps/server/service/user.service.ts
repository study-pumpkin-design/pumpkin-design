import type { userTypes } from "@sd/types";
import userRepository from "../repository/user.repository";
import { generateSalt, hashPassword } from "../util/password";
import mailService from "./mail.service";
import { SHARE_OTP_TEMPLATE, VERIFY_EMAIL_TEMPLATE } from "../util/template";
import { generateOTP, handleVerifyOTP } from "../util/otp";

class UserService {
  async createUserAccount(accountData: userTypes.createUserDTO) {
    const existingUser = await userRepository.getUser(accountData.email);
    if (existingUser != null) {
      throw new Error("DUPLICATE_USER_CREATION");
    }
    const salt = await generateSalt();
    const hashedPassword = await hashPassword(accountData.password, salt);

    const dbUser = await userRepository.createUser({
      ...accountData,
      password: hashedPassword,
      salt,
    });

    let template = VERIFY_EMAIL_TEMPLATE.replaceAll(
      "{{VERIFICATION_LINK}}",
      `${process.env.FRONTEND_URL}/verify-user?email=${dbUser.email}`,
    ).replaceAll("{{LOGO_URL}}", "");

    await mailService.sendMail(
      dbUser.email,
      "Pumpkin Design - verify account creation",
      template,
    );

    return dbUser;
  }
  async getUserDetails(userId: string, includeSensitive: boolean = false) {
    const dbUser = await userRepository.getUser(userId, includeSensitive);
    if (dbUser == null) {
      throw new Error("NO_USER_FOUND");
    }
    return dbUser;
  }

  async verifyUserAccount(email: string, otp: string) {
    const existingUser = await userRepository.getUser(email);
    if (existingUser == null) {
      throw new Error("USER_NOT_FOUND");
    }

    const verification = handleVerifyOTP(existingUser.email, otp, "EMAIL");
    const updatedUser = await userRepository.updateUser(existingUser.email, {
      email_verification: "VERIFIED",
    });

    if (updatedUser == null) throw new Error("VERIFICATION_ERROR");

    return updatedUser;
  }
  async sendEmailVerificationOTP(email: string) {
    const existingUser = await userRepository.getUser(email);
    if (existingUser == null) {
      throw new Error("USER_NOT_FOUND");
    }

    const otp = generateOTP(email, "EMAIL");
    let template = SHARE_OTP_TEMPLATE.replace("{{OTP}}", otp);
    await mailService.sendMail(
      existingUser.email,
      "Pumpkin design - Requested OTP",
      template,
    );

    return true;
  }
}
const userService = new UserService();
export default userService;

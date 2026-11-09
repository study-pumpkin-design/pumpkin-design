import type { loginTypes, userTypes } from "@sd/types";
import adminService from "./admin.service";
import mailService from "./mail.service";
import userService from "./user.service";
import userRepository from "../repository/user.repository";
import { generateAccessToken } from "../util/jwt";
import { comparePassword, generateSalt, hashPassword } from "../util/password";
import {
  generateOTP,
  generateState,
  handleVerifyOTP,
  validateState,
} from "../util/otp";
import {
  PASSWORD_RESET_SUCCESSFUL,
  SHARE_OTP_TEMPLATE,
} from "../util/template";

class AuthService {
  async adminLogin(credentials: loginTypes.LoginDTO) {
    const loginAccount = await this.checkCredentials(credentials, "ADMIN");
    if (loginAccount == null) {
      throw new Error("FAILED_AUTHENTICATION_ERROR");
    }

    return generateAccessToken(loginAccount, "ADMIN");
  }

  async userSignup(data: userTypes.createUserDTO) {
    const createdUser = await userService.createUserAccount(data);
    const token = await generateAccessToken(
      { email: createdUser.email },
      "USER",
    );

    return { createdUser, token };
  }

  async userLogin(credentials: loginTypes.LoginDTO) {
    const loginAccount = await this.checkCredentials(credentials, "USER");

    if (loginAccount == null) {
      throw new Error("FAILED_AUTHENTICATION_ERROR");
    }

    return generateAccessToken(loginAccount, "USER");
  }

  async initiateResetPassword(email: string) {
    const dbUser = await userService.getUserDetails(email);
    const OTP = await generateOTP(dbUser.email, "PASSWORD");

    const template = SHARE_OTP_TEMPLATE.replace("{{OTP}}", OTP);
    await mailService.sendMail(
      dbUser.email,
      "Pumpkin Design - reset password OTP",
      template,
    );
  }

  async verifyResetPassword(email: string, otp: string) {
    await userService.getUserDetails(email);
    await handleVerifyOTP(email, otp, "PASSWORD");
    await generateState(email, "PASSWORD_RESET");
  }

  async resetPassword(email: string, password: string) {
    await validateState(email, "PASSWORD_RESET");
    const salt = await generateSalt();
    const dbUser = await userService.getUserDetails(email, true);
    const hashedPassword = await hashPassword(password, salt);
    await userRepository.updateUser(dbUser.email, {
      password: hashedPassword,
      salt: salt,
    });

    await mailService.sendMail(
      dbUser.email,
      "Pumpkin Design - Password reset complete",
      PASSWORD_RESET_SUCCESSFUL,
    );
  }

  async checkCredentials(
    credentials: loginTypes.LoginDTO,
    accountType: "ADMIN" | "USER" = "USER",
  ) {
    let account = { email: "" };
    let isAuthenticated = false;

    if (accountType == "ADMIN") {
      const dbAdmin = await adminService.getAdminDetails(
        credentials.email ?? credentials.username ?? "",
        true,
      );

      isAuthenticated = await comparePassword(
        credentials.password,
        // @ts-ignore
        dbAdmin.password,
        // @ts-ignore
        dbAdmin.salt,
      );

      account.email = dbAdmin!.email;
    } else if (accountType == "USER") {
      const dbUser = await userService.getUserDetails(
        credentials.email ?? credentials.username ?? "",
        true,
      );

      isAuthenticated = await comparePassword(
        credentials.password,
        // @ts-ignore
        dbUser.password,
        // @ts-ignore
        dbUser.salt,
      );

      account.email = dbUser!.email;
    }

    return isAuthenticated ? { email: account?.email } : null;
  }
}

const authService = new AuthService();
export default authService;

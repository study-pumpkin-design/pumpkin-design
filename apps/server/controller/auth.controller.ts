import type { Request, Response } from "express";
import type { loginTypes, userTypes } from "@sd/types";
import { generateAccessToken } from "../util/jwt";
import adminService from "../service/admin.service";
import { comparePassword } from "../util/password";
import userService from "../service/user.service";
import { validateInput } from "../util/validator";
import { ERROR_CODES } from "../util/error-code";

class AuthController {
  constructor() {
    this.adminLogin = this.adminLogin.bind(this);
    this.userLogin = this.userLogin.bind(this);
    this.userSignup = this.userSignup.bind(this);
  }

  async adminLogin(req: Request, res: Response) {
    try {
      const credentials: loginTypes.LoginDTO = req.body;

      const loginAccount = await this.checkCredentials(credentials, "ADMIN");
      if (loginAccount == null) {
        throw new Error("FAILED_AUTHENTICATION_ERROR");
      }

      const token = await generateAccessToken(loginAccount, "ADMIN");
      res.appendHeader(
        "Set-Cookie",
        `token=${token}; HttpOnly; Secure=${process.env.NODE_ENV === "production"}; Path=/; Max-Age=60*60*24`,
      );

      return res.status(200).json({
        data: { accessToken: token },
        message: "login successful",
        statusCode: 200,
      });
    } catch (error) {
      console.log(error);
      let message = "Internal Server Error";

      return res.status(500).json({
        data: null,
        statusCode: 500,
        message,
      });
    }
  }
  async userSignup(req: Request, res: Response) {
    try {
      const data: userTypes.createUserDTO = req.body;
      if (
        !validateInput(data) ||
        typeof data.email !== "string" ||
        typeof data.username !== "string" ||
        typeof data.password !== "string"
      ) {
        throw new Error("INCORRECT_INPUT_DATA");
      }

      const createdUser = await userService.createUserAccount(data);
      const token = await generateAccessToken(
        { email: createdUser.email },
        "USER",
      );
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(201).json({
        data: { user: createdUser, token },
        message: "user created successfully",
        statusCode: 201,
      });
    } catch (error: any) {
      console.error("User signup failed", error);
      if (error.message == "DUPLICATE_USER_CREATION") {
        return res.status(409).json({
          data: null,
          message: ERROR_CODES.user.DUPLICATE_USER_CREATION,
          statusCode: 409,
        });
      }

      if (error.message == "INCORRECT_INPUT_DATA") {
        return res.status(400).json({
          data: null,
          message: ERROR_CODES.INCORRECT_INPUT_DATA,
          statusCode: 400,
        });
      }

      return res.status(500).json({
        data: null,
        statusCode: 500,
        message: "Internal Server Error",
      });
    }
  }
  async userLogin(req: Request, res: Response) {
    try {
      const credentials: loginTypes.LoginDTO = req.body;

      const loginAccount = await this.checkCredentials(credentials, "USER");

      if (loginAccount == null) {
        throw new Error("FAILED_AUTHENTICATION_ERROR");
      }

      const token = await generateAccessToken(loginAccount, "USER");
      res.appendHeader(
        "Set-Cookie",
        `token=${token}; HttpOnly; Secure=${process.env.NODE_ENV === "production"}; Path=/; Max-Age=60*60*24*7`,
      );

      return res.status(200).json({
        data: { accessToken: token },
        message: "login successful",
        statusCode: 200,
      });
    } catch (error) {
      console.error(error);
      let message = "Internal Server Error";

      return res.status(500).json({
        data: null,
        statusCode: 500,
        message,
      });
    }
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
const authController = new AuthController();
export default authController;

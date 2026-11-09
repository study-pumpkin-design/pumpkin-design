import type { Request, Response } from "express";
import type { loginTypes, userTypes } from "@sd/types";
import authService from "../service/auth.service";
import { ERROR_CODES } from "../util/error-code";
import { validateInput } from "../util/validator";

class AuthController {
  constructor() {
    this.adminLogin = this.adminLogin.bind(this);
    this.userLogin = this.userLogin.bind(this);
    this.userSignup = this.userSignup.bind(this);
  }

  async adminLogin(req: Request, res: Response) {
    try {
      const credentials: loginTypes.LoginDTO = req.body;
      const token = await authService.adminLogin(credentials);

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

      const { createdUser, token } = await authService.userSignup(data);

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
      const token = await authService.userLogin(credentials);

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

  async initiateResetPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (email.trim().length === 0) throw new Error("INVALID_INPUT");

      await authService.initiateResetPassword(email);

      return res.status(204).json({
        data: null,
        message: "OTP sent to email",
        statusCode: 204,
      });
    } catch (error: any) {
      console.error(error);
      let message = "Internal Server Error";

      return res.status(500).json({
        data: null,
        statusCode: 500,
        message,
      });
    }
  }

  async verifyResetPassword(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      if (email.trim().length === 0) throw new Error("INVALID_INPUT");
      if (otp.trim().length === 0) throw new Error("INVALID_INPUT");

      await authService.verifyResetPassword(email, otp);

      return res.status(204).json({
        data: null,
        message: "OTP verified",
        statusCode: 204,
      });
    } catch (error: any) {
      console.error(error);
      let message = "Internal Server Error";

      return res.status(500).json({
        data: null,
        message,
        statusCode: 500,
      });
    }
  }

  async resetPassword(req: Request, res: Response) {
    const { email, password } = req.body;

    if (email.trim().length === 0) throw new Error("INVALID_INPUT");
    if (password.trim().length === 0) throw new Error("INVALID_INPUT");

    await authService.resetPassword(email, password);

    return res.status(204).json({
      data: null,
      statusCode: 204,
      message: "Password reset successful",
    });
  }
}

const authController = new AuthController();
export default authController;

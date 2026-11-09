import type { Request, Response } from "express";
import userService from "../service/user.service";
import mailService from "../service/mail.service";
import { CONFIRM_VERIFICATION_TEMPLATE } from "../util/template";
class UserController {
  async startVerification(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (email.trim().length == 0) {
        throw new Error("INVALID_INPUT");
      }
      const dbUser = await userService.getUserDetails(email);
      await userService.sendEmailVerificationOTP(dbUser.email);

      return res.status(204).json({
        message: "mail sent",
        statusCode: 200,
        data: "OTP sent successfully",
      });
    } catch (error: any) {
      let message = "";
      console.log(error);
      return res.status(500).json({ message, statusCode: 500, data: null });
    }
  }
  async completeVerification(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      if (email.trim().length == 0) throw new Error("INVALID_INPUT");

      if (otp.trim().length == 0) throw new Error("INVALID_INPUT");

      await userService.getUserDetails(email);
      await userService.verifyUserAccount(email, otp);

      await mailService.sendMail(
        email,
        "Pumpkin Design - Verification Complete",
        CONFIRM_VERIFICATION_TEMPLATE,
      );
      return res.status(204).json({
        message: "account verified",
        statusCode: 200,
        data: "Account successfully verified",
      });
    } catch (error: any) {
      let message = "";
      console.log(error);

      return res.status(500).json({ message, statusCode: 500, data: null });
    }
  }
}
const userController = new UserController();
export default userController;

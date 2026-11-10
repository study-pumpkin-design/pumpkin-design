import type { Request, Response } from "express";
import type { adminTypes } from "@sd/types";
import { validateInput } from "../util/validator";
import adminService from "../service/admin.service";
import { ERROR_CODES } from "../util/error-code";

class AdminController {
  async getCurrentAdmin(req: Request, res: Response) {
    try {
      const admin = await adminService.getAdminDetails(req.user.email, false);

      return res.status(200).json({
        data: admin,
        message: "success",
        statusCode: 200,
      });
    } catch (error: any) {
      const message =
        error.message === "UNPERMITTED_ACTION_NOT_AN_ADMIN"
          ? ERROR_CODES.admin.UNPERMITTED_ACTION_NOT_AN_ADMIN
          : "Internal Server Error";

      return res.status(500).json({ data: null, message, statusCode: 500 });
    }
  }

  async createAdmin(req: Request, res: Response) {
    try {
      const data: adminTypes.createAdminDTO = req.body;

      if (!validateInput(data)) throw new Error("INCORRECT_INPUT_DATA");

      const createdAdmin = await adminService.createAdminAccount(
        data,
        req.user.email,
      );

      return res
        .status(200)
        .json({ data: createdAdmin, message: "success", statusCode: 200 });
    } catch (error: any) {
      let message = "";

      if (error.message == "UNPERMITTED_ACTION_NOT_AN_ADMIN") {
        message = ERROR_CODES.admin.UNPERMITTED_ACTION_NOT_AN_ADMIN;
      } else if (error.message == "INCORRECT_INPUT_DATA") {
        message = ERROR_CODES.INCORRECT_INPUT_DATA;
      } else if (error.message == "DUPLICATE_ADMIN_CREATION") {
        message = ERROR_CODES.admin.DUPLICATE_ADMIN_CREATION;
      } else {
        message = "Internal Server Error";
        console.log(error);
      }

      return res.status(500).status(500).json({
        data: null,
        message,
        statusCode: 500,
      });
    }
  }
}
const adminController = new AdminController();
export default adminController;

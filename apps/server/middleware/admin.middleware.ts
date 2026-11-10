import type { Request, Response, NextFunction } from "express";
import { ERROR_CODES } from "../util/error-code";
import { verifyAccessToken } from "../util/jwt";
import adminService from "../service/admin.service";
export default async function isAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await adminService.getAdminDetails(req.user.email);
    next();
  } catch (error: any) {
    console.log(error);

    let message = "Internal Server Error";
    if (error.message == "NO_ADMIN_FOUND") {
      message = ERROR_CODES.admin.UNPERMITTED_ACTION_NOT_AN_ADMIN;
    }

    return res.status(500).json({
      data: null,
      message,
      statusCode: 500,
    });
  }
}

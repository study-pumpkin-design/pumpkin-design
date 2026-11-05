import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../util/jwt";
import { ERROR_CODES } from "../util/error-code";

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error("NO_VALID_TOKEN_FOUND");

    const reqUser = verifyAccessToken(token);
    req.user = reqUser;

    next();
  } catch (error: any) {
    console.log(error);

    let message = "Internal Server Error";
    if (error.message == "NO_VALID_TOKEN_FOUND") {
      message = ERROR_CODES.NO_VALID_TOKEN_FOUND;
    } else if (error.message == "JWT_VERIFICATION_FAILIURE") {
      message = ERROR_CODES.JWT_VERIFICATION_FAILIURE;
    }

    return res.status(500).json({
      data: null,
      message,
      statusCode: 500,
    });
  }
}

export default authMiddleware;

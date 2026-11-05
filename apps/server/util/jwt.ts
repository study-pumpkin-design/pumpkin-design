import jwt from "jsonwebtoken";
import type { JwtPayload } from "@sd/types";

export function generateAccessToken(
  payload: JwtPayload,
  userType: "ADMIN" | "USER",
): string {
  const options = {
    expiresIn: userType == "ADMIN" ? "1d" : "7d",
  };

  //@ts-ignore
  const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, options);
  return token;
}

export function verifyAccessToken(accessToken: string) {
  try {
    return jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET as string,
    ) as JwtPayload;
  } catch (error) {
    throw new Error("JWT_VERIFICATION_FAILIURE");
  }
}

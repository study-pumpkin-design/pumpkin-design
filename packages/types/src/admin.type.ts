import type { typeMap } from "@sd/db";

export type Admin = typeMap["admin"];
export type createAdminDTO = Pick<
  Admin,
  "email" | "name" | "username" | "password"
> &
  Partial<Omit<Admin, "email" | "name" | "username">>;

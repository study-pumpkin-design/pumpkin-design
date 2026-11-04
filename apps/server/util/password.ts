import bcrypt from "bcrypt";

export const hashPassword = async (
  plainPassword: string,
  salt: string,
): Promise<string> => {
  return bcrypt.hash(plainPassword, salt);
};

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string,
  salt: string,
): Promise<boolean> => {
  const generatedHash = await bcrypt.hash(plainPassword, salt);
  return generatedHash === hashedPassword;
};

export const generateSalt = async (): Promise<string> => {
  return bcrypt.genSalt();
};

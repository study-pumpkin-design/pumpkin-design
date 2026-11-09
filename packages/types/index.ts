import * as adminTypes from "./src/admin.type";
import * as loginTypes from "./src/login.type";
import * as userTypes from "./src/user.type";
export type JwtPayload = {
  email: string;
};

export interface IMailService {
  sendMail(to: string, subject: string, template: string): Promise<boolean>;
}
export { adminTypes, loginTypes, userTypes };

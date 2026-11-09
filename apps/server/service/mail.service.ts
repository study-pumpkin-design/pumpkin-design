import type { IMailService } from "@sd/types";
import { ERROR_CODES } from "../util/error-code";
import NodeMailerService from "./node-mailer.service";

class MailService {
  instance: IMailService | null = null;
  constructor(provider: string) {
    switch (provider) {
      case "nodemailer":
        this.instance = new NodeMailerService(
          process.env.SMTP_USER!,
          process.env.SMTP_PASSWORD!,
        );
    }
  }
  async sendMail(
    to: string,
    subject: string,
    template: string,
  ): Promise<boolean> {
    try {
      if (!this.instance) throw new Error("CLASS_INITIALIZATION_ERROR");

      return this.instance?.sendMail(to, subject, template);
    } catch (error) {
      let message = "Failed to send email";

      if (message == "CLASS_INITIALIZATION_ERROR") {
        message = ERROR_CODES.mail.CLASS_INITIALIZATION_ERROR;
      }

      return false;
    }
  }
}
const mailService = new MailService("nodemailer");
export default mailService;

import nodemailer, {
  type Mail,
  type SMTPTransportOptions,
  type SentMessageInfo,
} from "nodemailer";
import type { IMailService } from "@sd/types";

class NodeMailerService implements IMailService {
  private transporter: Mail<SentMessageInfo, SMTPTransportOptions>;
  private user: string;

  constructor(user: string, pass: string) {
    this.user = user;

    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass,
      },
    });
  }

  async sendMail(
    to: string,
    subject: string,
    template: string,
  ): Promise<boolean> {
    await this.transporter.sendMail({
      from: `"sd_plat" <${this.user}>`,
      to,
      subject,
      html: template,
    });

    return true;
  }
}

export default NodeMailerService;

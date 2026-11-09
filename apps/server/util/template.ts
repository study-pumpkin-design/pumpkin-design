export const VERIFY_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,Helvetica,sans-serif;color:#111827;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td align="center" style="padding:36px 24px 24px;">
              <img src="{{LOGO_URL}}" alt="Pumpkin Design" width="160" style="display:block;width:160px;max-width:100%;height:auto;">
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px;">
              <div style="height:3px;background-color:#F97316;border-radius:3px;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px 16px;">
              <p style="margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#F97316;">
                Welcome to Pumpkin Design
              </p>
              <h1 style="margin:0 0 20px;font-size:28px;line-height:1.3;font-weight:700;color:#111827;">
                Verify your email address
              </h1>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.8;color:#4B5563;">
                Thank you for joining Pumpkin Design.
              </p>
              <p style="margin:0 0 28px;font-size:15px;line-height:1.8;color:#4B5563;">
                To complete your registration and get started, please verify your email address by clicking the button below.
              </p>
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
                <tr>
                  <td align="center" style="background-color:#F97316;border-radius:6px;">
                    <a href="{{VERIFICATION_LINK}}" style="display:inline-block;padding:16px 32px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">
                      Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 12px;font-size:13px;line-height:1.7;color:#6B7280;">
                If the button doesn't work, copy and paste the following link into your browser:
              </p>
              <p style="margin:0 0 28px;font-size:13px;line-height:1.7;word-break:break-all;">
                <a href="{{VERIFICATION_LINK}}" style="color:#F97316;text-decoration:underline;">
                  {{VERIFICATION_LINK}}
                </a>
              </p>
              <p style="margin:0 0 28px;font-size:13px;line-height:1.7;color:#6B7280;">
                If you did not create an account with Pumpkin Design, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px;background-color:#111827;">
              <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#F97316;">
                Pumpkin Design
              </p>
              <p style="margin:0;font-size:12px;line-height:1.7;color:#9CA3AF;">
                Smart enough to make mistake.
              </p>
              <p style="margin:16px 0 0;font-size:11px;color:#6B7280;">
                © 2026 Pumpkin Design. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
export const CONFIRM_VERIFICATION_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verified</title>
</head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:40px 15px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:12px;overflow:hidden;">
          <tr>
            <td align="center" style="background:#111827;padding:30px 20px;">
              <h1 style="margin:0;color:#F97316;font-size:27px;letter-spacing:2px;">PUMPKIN DESIGN</h1>
              <p style="margin:8px 0 0;color:#9CA3AF;font-size:11px;letter-spacing:2px;">SMART ENOUGH TO MAKE MISTAKE</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 35px;">
              <div style="text-align:center;margin-bottom:25px;">
                <div style="display:inline-block;background:#FFF1E8;border-radius:50%;padding:16px;">
                  <span style="color:#F97316;font-size:32px;">✓</span>
                </div>
              </div>
              <h2 style="color:#111827;font-size:25px;text-align:center;margin:0 0 20px;">Email Verified Successfully!</h2>
              <p style="color:#475569;font-size:15px;line-height:1.7;">Your email address has been successfully verified. Your account is now ready to use.</p>
              <p style="color:#475569;font-size:15px;line-height:1.7;">You can now sign in and access all the features available to you.</p>
              <table cellpadding="0" cellspacing="0" style="margin:30px auto;">
                <tr>
                  <td align="center" bgcolor="#F97316" style="border-radius:6px;">
                    <a href="{{login_url}}" style="display:inline-block;padding:15px 35px;color:#FFFFFF;text-decoration:none;font-size:15px;font-weight:bold;">Get Started</a>
                  </td>
                </tr>
              </table>
              <p style="color:#475569;font-size:14px;line-height:1.7;">Thank you for joining us. We're glad to have you on board!</p>
              <p style="color:#111827;font-size:14px;line-height:1.7;margin-top:25px;">Happy Building,<br><strong style="color:#F97316;">Team Pumpkin Design</strong></p>
            </td>
          </tr>
          <tr>
            <td align="center" style="background:#111827;padding:25px 20px;">
              <p style="color:#9CA3AF;font-size:11px;margin:0;">© 2026 Pumpkin Design. All rights reserved.</p>
              <p style="color:#9CA3AF;font-size:11px;margin:8px 0 0;">Smart enough to make mistake.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const SHARE_OTP_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pumpkin Design - Email Verification</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,Helvetica,sans-serif;color:#111827;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td align="center" style="padding:36px 24px 24px;">
              <img src="{{LOGO_URL}}" alt="Pumpkin Design" width="160" style="display:block;width:160px;max-width:100%;height:auto;">
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px;">
              <div style="height:3px;background-color:#F97316;border-radius:3px;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px 16px;">
              <p style="margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#F97316;">
                Email Verification
              </p>
              <h1 style="margin:0 0 20px;font-size:28px;line-height:1.3;font-weight:700;color:#111827;">
                Your verification code
              </h1>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.8;color:#4B5563;">
                Welcome to Pumpkin Design. Use the verification code below to confirm your email address and complete your registration.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                <tr>
                  <td align="center" style="background-color:#FFF7ED;border:1px solid #FED7AA;border-radius:8px;padding:24px 16px;">
                    <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:2px;color:#9A3412;">
                      YOUR ONE-TIME PASSWORD
                    </p>
                    <p style="margin:0;font-size:36px;font-weight:700;letter-spacing:10px;color:#F97316;">
                      {{OTP}}
                    </p>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 16px;font-size:14px;line-height:1.8;color:#4B5563;">
                This code is valid for <strong>10 minutes</strong>. Please do not share it with anyone.
              </p>
              <p style="margin:0 0 28px;font-size:13px;line-height:1.7;color:#6B7280;">
                If you did not request this code, you can safely ignore this email. Your account will remain secure.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px;background-color:#111827;">
              <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#F97316;">
                Pumpkin Design
              </p>
              <p style="margin:0;font-size:12px;line-height:1.7;color:#9CA3AF;">
                Smart enough to make mistake.
              </p>
              <p style="margin:16px 0 0;font-size:11px;color:#6B7280;">
                © 2026 Pumpkin Design. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

export const PASSWORD_RESET_SUCCESSFUL = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:40px 15px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:12px;overflow:hidden;">
          <tr>
            <td align="center" style="background:#111827;padding:30px 20px;">
              <h1 style="margin:0;color:#F97316;font-size:27px;letter-spacing:2px;">PUMPKIN DESIGN</h1>
              <p style="margin:8px 0 0;color:#9CA3AF;font-size:11px;letter-spacing:2px;">SMART ENOUGH TO MAKE MISTAKE</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 35px;">
              <div style="text-align:center;margin-bottom:25px;">
                <div style="display:inline-block;background:#FFF1E8;border-radius:50%;padding:16px;">
                  <span style="color:#F97316;font-size:32px;">✓</span>
                </div>
              </div>
              <h2 style="color:#111827;font-size:25px;text-align:center;margin:0 0 20px;">Password Reset Successful!</h2>
              <p style="color:#475569;font-size:15px;line-height:1.7;">Your password has been successfully updated.</p>
              <p style="color:#475569;font-size:15px;line-height:1.7;">You can now sign in using your new password and continue accessing your account.</p>
              <p style="color:#475569;font-size:14px;line-height:1.7;margin-top:25px;">If you did not make this change, please contact our support team immediately to secure your account.</p>
              <p style="color:#111827;font-size:14px;line-height:1.7;margin-top:30px;">Best Regards,<br><strong style="color:#F97316;">Team Pumpkin Design</strong></p>
            </td>
          </tr>
          <tr>
            <td align="center" style="background:#111827;padding:25px 20px;">
              <p style="color:#9CA3AF;font-size:11px;margin:0;">© 2026 Pumpkin Design. All rights reserved.</p>
              <p style="color:#9CA3AF;font-size:11px;margin:8px 0 0;">Smart enough to make mistake.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

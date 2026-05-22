import SendEmail from "./SendEmail.js";

const sendPasswordResetEmail = async ({ name, email, passwordResetToken, origin }) => {
  const resetURL = `${origin}/auth/reset-password?token=${passwordResetToken}&email=${email}`;

  const emailTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Password Reset</title>
    </head>
    <body style="margin:0;padding:40px 16px;background:#f4f4f4;font-family:'Segoe UI',sans-serif;">
      <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:8px;padding:40px 32px;border:1px solid #e5e5e5;">

        <p style="font-size:16px;color:#111;margin:0 0 12px;">Hello <strong>${name}</strong>,</p>

        <p style="font-size:15px;color:#444;line-height:1.6;margin:0 0 28px;">
          Here is your password reset link. It expires in <strong>1 hour</strong>.
        </p>

        <a href="${resetURL}"
           style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:14px;font-weight:600;">
          Reset Password
        </a>

        <p style="font-size:13px;color:#888;margin:28px 0 0;line-height:1.6;">
          If you didn't request this, you can safely ignore this email.
        </p>

        <hr style="margin:28px 0;border:none;border-top:1px solid #eee;" />

        <p style="font-size:12px;color:#aaa;margin:0;">
          © ${new Date().getFullYear()} Oasis Ascend . All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;

  return SendEmail({
    to: email,
    subject: "Reset your Oasis Ascend  password",
    html: emailTemplate,
  });
};

export default sendPasswordResetEmail;
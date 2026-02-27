import nodemailer from "nodemailer";

// Create transporter
// Automatically use Resend SMTP if an API key is provided, 
// otherwise check for generic SMTP, and fallback to Ethereal Email for Dev.
const createTransporter = async () => {
  if (process.env.RESEND_API_KEY) {
    return nodemailer.createTransport({
      host: "smtp.resend.com",
      port: 465,
      secure: true,
      auth: {
        user: "resend",
        pass: process.env.RESEND_API_KEY,
      },
    });
  }

  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback to Ethereal for dev
  const testAccount = await nodemailer.createTestAccount();
  console.log("📨 Using Ethereal Email for development");
  console.log(`   User: ${testAccount.user}`);
  console.log(`   Pass: ${testAccount.pass}`);

  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

let transporter: nodemailer.Transporter | null = null;

const getTransporter = async () => {
  if (!transporter) {
    transporter = await createTransporter();
  }
  return transporter;
};

export const emailService = {
  /**
   * Send workspace invitation email
   */
  sendWorkspaceInvite: async (
    to: string,
    workspaceName: string,
    inviterName: string,
    inviteToken: string,
  ) => {
    try {
      const transport = await getTransporter();
      const inviteLink = `http://localhost:3000/accept-invite?token=${inviteToken}`;

      const info = await transport.sendMail({
        from: '"TrackCodex" <onboarding@resend.dev>', // Resend domains must be verified, fallback to onboarding@resend.dev for testing
        to,
        subject: `You've been invited to join ${workspaceName} on TrackCodex`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e4e8; border-radius: 6px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #24292e;">TrackCodex Workspace Invitation</h2>
            </div>
            <p>Hello,</p>
            <p><strong>${inviterName}</strong> has invited you to join the workspace <strong>${workspaceName}</strong> on TrackCodex.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${inviteLink}" style="background-color: #2ea44f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Accept Invitation</a>
            </div>
            <p style="color: #586069; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <p style="background-color: #f6f8fa; padding: 10px; border-radius: 6px; font-size: 12px; word-break: break-all;">${inviteLink}</p>
            <p style="color: #586069; font-size: 12px; margin-top: 30px; text-align: center;">This link will expire in 7 days.</p>
          </div>
        `,
      });

      console.log(`📧 Invite email sent to ${to}`);
      if (!process.env.RESEND_API_KEY && !process.env.SMTP_HOST) {
        console.log(`🔗 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }

      return true;
    } catch (error) {
      console.error("Failed to send invite email:", error);
      return false;
    }
  },

  /**
   * Send a general application notification email (Job Offers, Updates, etc.)
   */
  sendAppNotification: async (
    to: string,
    title: string,
    message: string,
    link?: string
  ) => {
    try {
      const transport = await getTransporter();
      const actionHtml = link
        ? `<div style="text-align: center; margin: 30px 0;">
             <a href="${link}" style="background-color: #0969da; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Details</a>
           </div>`
        : "";

      const info = await transport.sendMail({
        from: '"TrackCodex" <onboarding@resend.dev>', // Resend testing domain
        to,
        subject: title,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e4e8; border-radius: 6px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #24292e;">${title}</h2>
            </div>
            <p style="color: #24292e; font-size: 16px; line-height: 1.5;">${message}</p>
            ${actionHtml}
            <hr style="border: 0; border-top: 1px solid #e1e4e8; margin-top: 30px; margin-bottom: 20px;" />
            <p style="color: #586069; font-size: 12px; text-align: center;">This is an automated notification from TrackCodex.</p>
          </div>
        `,
      });

      console.log(`📧 Notification email sent to ${to}`);
      if (!process.env.RESEND_API_KEY && !process.env.SMTP_HOST) {
        console.log(`🔗 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }

      return true;
    } catch (error) {
      console.error("Failed to send notification email:", error);
      return false;
    }
  },
};

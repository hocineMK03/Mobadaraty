const config = require("../config/config");
const nodemailer = require("nodemailer");
const authJWT = require("../middlewares/authJWT");

class EmailServices {
  async sendInvitationnEmail(inviteeEmail, inviterEmail, specialToken) {
    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: config.smtpGmail,
        pass: config.smtpAppPassword,
      },
    });

    console.log("Sending invitation email to:", inviteeEmail);

    // Generate JWT containing inviteeEmail, inviterEmail, and specialToken
    const token = authJWT.createEmailInvitation({
      inviteeEmail,
      inviterEmail,
      specialToken,
    });

    const FRONTEND_URL = config.frontendURL;
    const registrationURL = `${FRONTEND_URL}/register`;

    // Email content
    const html = `
      <h1>You've Been Invited!</h1>
      <p>Hello,</p>
      <p><strong>${inviterEmail}</strong> has invited you to join our platform.</p>
      <p>Use this special code when creating your account: <strong>${token}</strong></p>
      <p>Click the link below to register:</p>
      <a href="${registrationURL}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Register Now</a>
      <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
      <p>${registrationURL}</p>
      <p>Best regards,<br>Your Company Team</p>
    `;

    const mailOptions = {
      from: config.smtpGmail,
      to: inviteeEmail,
      subject: "You're Invited! Use Your Special Code",
      html: html,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Invitation email sent to ${inviteeEmail}`);
      return true;
    } catch (error) {
      console.error(`Failed to send invitation email to ${inviteeEmail}:`, error);
      return false;
    }
  }
}

module.exports = new EmailServices;

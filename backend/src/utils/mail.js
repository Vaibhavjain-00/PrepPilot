import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import { ApiError } from "./ApiError.js";

const transporter = nodemailer.createTransport({
  // host: process.env.MAILTRAP_SMTP_HOST,
  // port: process.env.MAILTRAP_SMTP_PORT,
  // auth: {
  //   user: process.env.MAILTRAP_SMTP_USER,
  //   pass: process.env.MAILTRAP_SMTP_PASS,

  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendEmail = async (options) => {
  if (!options.email || !options.subject || !options.mailgenContent) {
    throw new ApiError(400, "Email options are incomplete.");
  }
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "PrepPilot",
      link: "http://localhost:5173",
    },
  });

  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);

  const emailHtml = mailGenerator.generate(options.mailgenContent);

  const mail = {
    from:`"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    text: emailTextual,
    html: emailHtml,
  };

   try {
    const info = await transporter.sendMail(mail);
    return info;

  } catch (error) {

    throw new ApiError(
      500,
      "Failed to send email."
    );
  }
};

const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our PrepPilot! we'are excited to have you on board.",
      action: {
        instructions:
          "To verify your email please click on the following button",
        button: {
          color: "#22BC66",
          text: "Verify your email",
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset the password of your account",
      action: {
        instructions:
          "To reset your password click on the following button or link",
        button: {
          color: "#22BC66",
          text: "Reset password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export {
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  sendEmail,
};

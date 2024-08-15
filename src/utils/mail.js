import { createTransport } from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";

import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = createTransport({
  host: process.env.MAIL_SMTP_HOST,
  port: process.eventNames.MAIL_SMTP_PORT,
  auth: {
    user: process.env.MAIL_SMTP_USER,
    pass: process.env.MAIL_SMTP_PASS,
  },
});

const renderEmail = (username) => {
  const templateSource = fs.readFileSync(`${__dirname}/../utils/templates/contact.hbs`, "utf8");

  const emailTemplate = handlebars.compile(templateSource);

  var replacements = {
    username,
  };

  const htmlToSend = emailTemplate(replacements);

  return htmlToSend;
};

export const sendQueryMails = async (options) => {
  const messageId = Date.now();

  const userMailOptions = {
    from: {
      name: "eKalakaar",
      address: process.env.MAIL_SMTP_USER,
    },
    to: options.email,
    subject: "Thank You for Your Interest in eKalakaar!",
    html: renderEmail(options.name),
  };

  const teamMailHtml = `
  <h1>${options.query.name} - ${options.query.subject} - ${new Date(options.query.createdAt).toDateString()}</h1>

  <h2>The details of the email as per template -</h2>

  <p><strong>Name :</strong> ${options.query.name}</p>
  <p><strong>Organization :</strong> ${options.query.organization ? options.query.organization : "NA"}</p>
  <p><strong>Email Id :</strong> ${options.query.email}</p>
  <p><strong>Contact No. :</strong> ${options.query.phoneNumber}</p>
  <p><strong>Subject :</strong> ${options.query.subject}</p>
  <p><strong>Message :</strong> ${options.query.message}</p>
  <p><strong>Link :</strong> ${options.query.link ? options.query.link : "NA"}</p>
  <p><strong>Location :</strong> ${options.query.location ? options.query.location : "NA"}</p>
  <p><strong>Intrested In :</strong> ${options.query.intrestedIn ? options.query.intrestedIn : "NA"}</p>
  `;

  const teamMailOptions = {
    from: {
      name: "eKalakaar",
      address: process.env.MAIL_SMTP_USER,
    },
    to: process.env.MAIL_SMTP_USER,
    subject: options.query.subject,
    html: teamMailHtml,
    headers: {
      "Message-ID": messageId,
      "In-Reply-To": messageId,
    },
  };

  try {
    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(teamMailOptions);
    console.log("query email sent to user.");
    console.log("query email sent to ekalakaar team.");
  } catch (error) {
    console.log("Email service failed silently.");
    console.log("Error: ", error);
  }
};

export const sendForgotPasswordOtp = async (options) => {
  const messageId = Date.now();

  const mail = {
    from: {
      name: "eKalakaar",
      address: process.env.MAIL_SMTP_USER,
    },
    to: options.email,
    subject: "Forgot Password",
    html: `
    <p>Dear <strong>${options.name}</strong>,</p>

    <p>Your One Time Password (OTP) for resetting the password is ${options.otp}. This OTP is valid for 10 minutes. On expiry, kindly regenerate the OTP.</p>

    <p>Regards</p>

    <p>Team <strong>eKalakaar</strong></p>
    `,
    headers: {
      "Message-ID": messageId,
      "In-Reply-To": messageId,
    },
  };

  try {
    await transporter.sendMail(mail);
    console.log("forgot password otp mail sent to user.");
  } catch (error) {
    console.log("Email service failed silently.");
    console.log("Error: ", error);
  }
};

export const sendRegisterrOtp = async (options) => {
  const messageId = Date.now();

  const mail = {
    from: {
      name: "eKalakaar",
      address: process.env.MAIL_SMTP_USER,
    },
    to: options.email,
    subject: "One Time Password For Registration",
    html: `
    <p>Dear <strong>${options.name}</strong>,</p>

    <p>Your One Time Password (OTP) for <strong>Registration</strong> is ${options.otp}. This OTP is valid for 10 minutes. On expiry, kindly regenerate the OTP.</p>

    <p>Regards</p>

    <p>Team <strong>eKalakaar</strong></p>
    `,
    headers: {
      "Message-ID": messageId,
      "In-Reply-To": messageId,
    },
  };

  try {
    await transporter.sendMail(mail);
    console.log("Registration otp mail sent to user.");
  } catch (error) {
    console.log("Email service failed silently.");
    console.log("Error: ", error);
  }
};

export const sendWelcomeMail = async (options) => {
  const messageId = Date.now();
  const mail = {
    from: {
      name: "eKalakaar",
      address: process.env.MAIL_SMTP_USER,
    },
    to: options.email,
    subject: "Welcome to eKalakaar (eK)!",
    html: `
    <p>Dear <strong>${options.name}</strong>,</p>

  
   <p>Greetings from <strong>eKalakaar(eK)</strong> - your digital platform for connecting traditional performing artists as opportunity seekers with patrons as talent seekers for creating unique performance opportunities. </p>
   <p>Thank you for joining us on this exciting journey. We look forward to being a part of your artistic endeavors.</p>

    <p>Warm Regards,</p>
    <p><strong>eKalakaar(eK)</strong></p>
    <p>E-mail ID: eK@eKalakaar.com </p>
    <p>WhatsApp: +91 7701872112 </p>
    <p>www.eKalakaar.com</p>
     
    `,
    headers: {
      "Message-ID": messageId,
      "In-Reply-To": messageId,
    },
  };

  try {
    await transporter.sendMail(mail);
    console.log("welcome mail sent to user.");
  } catch (error) {
    console.log("Email service failed silently.");
    console.log("Error: ", error);
  }
};

export const sendPasswordResetSuccessMail = async (options) => {
  const messageId = Date.now();

  const mail = {
    from: {
      name: "eKalakaar",
      address: process.env.MAIL_SMTP_USER,
    },
    to: options.email,
    subject: "Your Password Reset was Successful",
    html: `
    <p>Dear <strong>${options.name}</strong>,</p>

    <p>We're writing to confirm that your password has been successfully reset. If you have any further questions or concerns, please don't hesitate to reach out.</p>

    <p>Best regards,</p>

    <p>Team <strong>eKalakaar</strong></p>
    `,
    headers: {
      "Message-ID": messageId,
      "In-Reply-To": messageId,
    },
  };

  try {
    await transporter.sendMail(mail);
    console.log("password reset confirmation mail sent to user.");
  } catch (error) {
    console.log("Email service failed silently.");
    console.log("Error: ", error);
  }
};

// ========== Solution #1 - SendGrid ==========

const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
  const email = { ...data, from: "rizorno@gmail.com" };
  await sgMail.send(email);
  return true;
};

module.exports = sendEmail;

// ========== Solution #2 - Nodemailer ==========

// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const { META_PASSWORD } = process.env;

// const nodemailerConfig = {
//   host: "smtp.meta.ua",
//   port: 465,
//   secure: true,
//   auth: {
//     user: "rizorno@meta.ua",
//     pass: META_PASSWORD,
//   },
// };

// const transport = nodemailer.createTransport(nodemailerConfig);

// const sendEmail = async (data) => {
//   const email = { ...data, from: "rizorno@meta.ua" };
//   await transport.sendMail(email);
//   return true;
// };

// module.exports = sendEmail;

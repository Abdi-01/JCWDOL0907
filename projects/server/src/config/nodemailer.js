const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ichsannuriman12@gmail.com",
    pass: "zsflnyniejbhwxzg",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = transporter;

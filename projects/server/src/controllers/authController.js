const { db, query } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../config/nodemailer");
const { validationResult } = require("express-validator");
const ejs = require("ejs");
const path = require("path");

module.exports = {
  register: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw {
          status_code: 400,
          message: `${errors.array()[0].msg} (Backend)`,
          errors: errors.array(),
        };
      }

      const { name, email, password, phone } = req.body;

      const getEmailQuery = `SELECT * FROM users WHERE email=${db.escape(email)}`;
      const isEmailExist = await query(getEmailQuery);
      if (isEmailExist.length > 0) {
        throw { status_code: 400, message: "Email has been used" };
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const addUserQuery = `INSERT INTO users VALUES (null, ${db.escape(email)}, ${db.escape(hashPassword)}, ${db.escape(name)},null,null,${db.escape(phone)}, null, false, false)`;

      const addUserResult = await query(addUserQuery);

      // //--------------------------------------------------------------------

      let payload = { id: addUserResult.insertId };
      const token = jwt.sign(payload, "joe", { expiresIn: "4h" });

      const renderEmailTemplate = (templatePath, data) => {
        const filePath = path.join(__dirname, templatePath);
        return ejs.renderFile(filePath, data);
      };

      const template = await renderEmailTemplate("../templates/emailTemplate.ejs", { name, token });

      const mail = {
        from: `Admin <ichsannuriman12@gmail.com>`,
        to: `${email}`,
        subject: `Acount Verification`,
        html: template,
      };

      const response = await transporter.sendMail(mail);

      // //--------------------------------------------------------------------

      return res.status(200).send({ data: addUserResult, message: "Register success" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  verification: async (req, res, next) => {
    try {
      const id = req.user.id;

      const checkAccountQuery = `SELECT * FROM users WHERE user_id=${db.escape(id)}`;
      const isAccountExist = await query(checkAccountQuery);

      if (isAccountExist[0].is_verified == true) {
        throw {
          status_code: 400,
          message: "Account has been verified before.",
        };
      }

      const updateIsActiveQuery = `UPDATE users SET is_verified = true WHERE user_id = ${db.escape(id)}`;
      let updateResponse = await query(updateIsActiveQuery);

      res.status(200).send({ message: "Account is verified" });
    } catch (error) {
      next(error);
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const isEmailExist = await query(`SELECT * FROM users WHERE email=${db.escape(email)}`);
      if (isEmailExist.length == 0) {
        throw {
          status_code: 400,
          message: "Email or password is incorrect",
        };
      }

      const isValid = await bcrypt.compare(password, isEmailExist[0].password);

      if (!isValid) {
        throw {
          status_code: 400,
          message: "Email or password is incorrect",
        };
      }

      if (isEmailExist[0].is_verified == false) {
        throw {
          status_code: 400,
          message: "Account is not verified yet, check your email",
        };
      }

      const payload = {
        id: isEmailExist[0].user_id,
      };

      const token = jwt.sign(payload, "joe", { expiresIn: "1h" });

      return res.status(200).send({
        message: "Login Success",
        token,
        data: {
          user_id: isEmailExist[0].user_id,
          name: isEmailExist[0].name,
          email: isEmailExist[0].email,
          phone_number: isEmailExist[0].phone_number,
          is_verified: isEmailExist[0].is_verified,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  checkLogin: async (req, res, next) => {
    try {
      const users = await query(`SELECT * FROM users WHERE user_id = ${db.escape(req.user.id)}`);

      return res.status(200).send({
        data: {
          user_id: users[0].user_id,
          name: users[0].name,
          email: users[0].email,
          phone_number: users[0].phone_number,
          is_verified: users[0].is_verified,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

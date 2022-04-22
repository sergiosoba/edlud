import Student from "../models/Student";
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
var jwt = require("jsonwebtoken");
import { MAIL, MAIL_PASS, PORT, SECRET } from "../config";

export const renderStudents = async (req, res) => {
  const students = await Student.find().lean();
  res.render("index", { students: students });
};

export const register = async (req, res) => {
  try {
    const token = jwt.sign({ email: req.body.email }, SECRET);

    const student = new Student({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      confirmationCode: token,
    });
    await student.save();

    try {
      await sendMail(req, token);
    } catch (error) {
      res.status(400).send(error); // 400???
    }

    return res
      .status(201)
      .send((({ firstName, email }) => ({ firstName, email }))(student));
  } catch (error) {
    return res.status(500).send(error);
  }
};

const sendMail = async (req, token) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: MAIL,
      pass: MAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let host = req.hostname;
  if (host != "edlud.herokuapp.com") host += ":" + PORT;
  let mailOptions = {
    from: `'Sergio de Edlud 👨‍🏫' <${MAIL}>`,
    to: req.body.email,
    subject: "Edlud - Confirmación de correo",
    html: `<h3>Hola ${req.body.firstName},</h3>
    <p>¡Gracias por unirte a Edlud!
    Por favor, confirma tu correo haciendo clic en el siguiente enlace:
    <a href=http://${host}/confirm/${token}>Clic aquí</a></p>
    </div>`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("Error occurred. " + err.message);
      return process.exit(1);
    }

    console.log("Message sent: %s", info.messageId);
  });
};

export const verify = async (req, res) => {
  Student.findOne({ confirmationCode: req.params.confirmationCode })
    .then((student) => {
      if (!student) {
        return res.status(404).send({ message: "User Not found." });
      }

      student.active = true;
      student.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        res.render("confirmed", { firstName: student.firstName });
      });
    })
    .catch((e) => console.log("error", e));
};

export const login = async (req, res) => {
  try {
    var student = await Student.findOne(
      { email: req.body.email },
      "firstName email password active"
    ).exec();

    if (!student)
      return res.status(400).send({ message: "Invalid credentials - email" });

    if (!bcrypt.compareSync(req.body.password, student.password))
      return res.status(400).send({ message: "Invalid credentials - pass" });

    if (student.active) {
      res
        .status(202)
        .send((({ firstName, email }) => ({ firstName, email }))(student));
    } else {
      res.status(409).send({ msg: "Email don't confirmed" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

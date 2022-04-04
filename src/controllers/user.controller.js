import Student from "../models/Student";
const bcrypt = require("bcrypt");

export const renderStudents = async (req, res) => {
  const students = await Student.find().lean();
  res.render("index", { students: students });
};

export const register = async (req, res) => {
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    const student = Student(req.body); //new
    await student.save();

    return res
      .status(201)
      .send((({ firstName, email }) => ({ firstName, email }))(student));
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const login = async (req, res) => {
  try {
    var student = await Student.findOne(
      { email: req.body.email },
      "firstName email password"
    ).exec();

    if (!student)
      return res.status(400).send({ message: "Invalid credentials - email" });

    if (!bcrypt.compareSync(req.body.password, student.password))
      return res.status(400).send({ message: "Invalid credentials - pass" });

    res
      .status(202)
      .send((({ firstName, email }) => ({ firstName, email }))(student));
  } catch (error) {
    response.status(500).send(error);
  }
};

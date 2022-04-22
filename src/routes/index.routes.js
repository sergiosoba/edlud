import { Router } from "express";

import {
  renderStudents,
  login,
  register,
  verify,
} from "../controllers/user.controller";

const router = Router();

router.get("/", renderStudents);

router.post("/login", login);
router.post("/register", register);

router.get("/confirm/:confirmationCode", verify);

export default router;

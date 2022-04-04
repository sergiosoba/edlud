import { Router } from "express";

import { renderStudents, login, register } from "../controllers/user.controller";

const router = Router();

router.get("/", renderStudents);

router.post("/login", login);
router.post("/register", register);

export default router;

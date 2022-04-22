import { config } from "dotenv";

config();

export const MONGODB_URI = process.env.MONGODB_URI;

export const PORT = process.env.PORT;

export const SECRET = process.env.SECRET;

export const MAIL = process.env.MAIL;
export const MAIL_PASS = process.env.MAIL_PASS;

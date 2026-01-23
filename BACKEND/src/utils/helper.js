import { nanoid } from "nanoid";
import { cookieOptions } from "../config/config.js";
import jsonwebtoken from "jsonwebtoken";

export const generateNanoId = (length) => {
  return nanoid(length);
};


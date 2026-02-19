import { findUserById } from "../dao/user.dao.js";
import { verifyToken } from "../utils/helper.js";

const getAccessToken = (req) => {
  const cookieToken = req.cookies?.accessToken;
  if (cookieToken) return cookieToken;

  const authHeader = req.headers.authorization;
  if (typeof authHeader !== "string") return null;
  if (!authHeader.toLowerCase().startsWith("bearer ")) return null;
  return authHeader.slice(7).trim() || null;
};

export const authMiddleware = async (req, res, next) => {
  const token = getAccessToken(req);
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded = verifyToken(token);
    const user = await findUserById(decoded);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized", error });
  }
};

export { authMiddleware as protect };
export default authMiddleware;

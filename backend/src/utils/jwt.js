import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,              // secret key
    { expiresIn: process.env.JWT_EXPIRES_IN } // default fallback
  );
};


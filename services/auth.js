import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./models/users";

const authService = {
  generateToken: (userId) => {
    const payload = { userId };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  },

  hashPassword: async (password) => {
    return await bcrypt.hash(password, 10);
  },

  comparePasswords: async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
  },
};

export default authService;

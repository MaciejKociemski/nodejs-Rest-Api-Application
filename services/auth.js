import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "./models/users";

const generateToken = (userId) => {
  const payload = { userId };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  return token;
};

const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = generateToken(user._id);

    return token;
  } catch (error) {
    throw error;
  }
};

const authService = {
  generateToken,
  loginUser,
};

export default authService;

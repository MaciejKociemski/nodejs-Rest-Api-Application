import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from './models/users';

const generateToken = (userId) => {
  const payload = { userId };
  const token = jwt.sign(payload, "your-secret-key", { expiresIn: "1h" });
  return token;
};

const loginUser = async (email, password) => {
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
};

const authService = {
  generateToken,
  loginUser,
};

export default authService;
import express from "express";
import Joi from "joi";
import authService from "../../services/auth"; 
import User from "../../services/models/users"

const router = express.Router();

const signupValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

router.post("/signup", async (req, res, next) => {
  try {
    const { error } = signupValidationSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: "Validation error", error: error.details });
    }

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    const hashedPassword = await authService.hashPassword(req.body.password);

    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    return next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
      console.log("email:", email);
      console.log("password:", password);
      
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const passwordMatch = await authService.comparePasswords(
      password,
      user.password
    );
    if (!passwordMatch) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const token = authService.generateToken(user._id);

    return res
      .status(200)
      .json({
        token,
        user: { email: user.email, subscription: user.subscription },
      });
  } catch (err) {
    return next(err);
  }
});

export default router;
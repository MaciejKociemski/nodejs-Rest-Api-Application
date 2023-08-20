import express from "express";
import authService from "../../services/auth"; 
const router = express.Router();


router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const token = await authService.loginUser(email, password);
    res.json({
      status: 200,
      statusText: "OK",
      data: {
        token,
      },
    });
  } catch (err) {
    res.status(401).json({
      status: 401,
      statusText: "Unauthorized",
      message: "Invalid credentials",
    });
  }
});

export default router;

import jwt from "jsonwebtoken";
require('dotenv').config();

const jwtMiddleware = (req, res, next) => {
    const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({
      status: 401,
      statusText: "Unauthorized",
      message: "No token, authorization denied",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({
      status: 401,
      statusText: "Unauthorized",
      message: "Token is not valid",
    });
  }
};

export default jwtMiddleware;

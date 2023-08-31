import express from "express";
import multer from 'multer';
import auth from "./authorization.js";
import usersController from "../controllers/users.js";

const upload = multer({ dest: 'tmp/' });
const usersRouter = express.Router();

usersRouter.post("/signup", usersController.register);
usersRouter.post("/login", usersController.login);
usersRouter.post("/logout", auth, usersController.logout);
usersRouter.get("/current", auth, usersController.getCurrent);
usersRouter.patch("/subscription", auth, usersController.setSubscription);
usersRouter.patch("/avatars",auth,upload.single("avatar"),usersController.updateAvatar);

usersRouter.get("/verify/:verificationToken", async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const user = await service.getUser({ verificationToken });
    if (!user) {
      return res.status(404).json({
        status: 404,
        statusText: "Not Found",
        data: { message: "User not found" },
      });
    }

    user.verify = true;
    user.verificationToken = null;
    await user.save();

    res.json({
      status: 200,
      statusText: "OK",
      data: { message: "Verification successful" },
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      statusText: "Internal Server Error",
      data: { message: err.message },
    });
  }
});

export default usersRouter;
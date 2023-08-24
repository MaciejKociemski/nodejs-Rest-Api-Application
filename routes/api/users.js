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

usersRouter.patch("/subscription", auth, usersController.setSubscription);

export default usersRouter;
import express from "express";
import auth from "./authorization.js";
import usersController from "../controllers/users.js";

const usersRouter = express.Router();
const API_PREFIX = "/users";

usersRouter.post(`${API_PREFIX}/signup`, usersController.register);
usersRouter.post(`${API_PREFIX}/login`, usersController.login);
usersRouter.post(`${API_PREFIX}/logout`, auth, usersController.logout);
usersRouter.get(`${API_PREFIX}/current`, auth, usersController.getCurrent);
usersRouter.patch(
  `${API_PREFIX}/subscription`,
  auth,
  usersController.setSubscription
);


export default usersRouter;

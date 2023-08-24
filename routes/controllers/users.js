import jwt from "jsonwebtoken";
import bCrypt from "bcryptjs";
import service from "../../services/users.js";
import gravatar from "gravatar";
import jimp from "jimp";
import path from "path";

import {
  userRegisterSchema,
  userLoginSchema,
  userLogoutSchema,
  userSubSchema,
} from "../../utils/validation.js";

const register = async (req, res, next) => {
  try {
    const { body } = req;
    const { username, email, password } = body;

    if (Object.keys(body).length) {
      const { error } = userRegisterSchema.validate(body);
      if (error) {
        return res.status(400).json({
          status: 400,
          statusText: "Bad Request",
          data: { message: error.message },
        });
      }
    }

    const avatarURL = gravatar.url(email, { s: "200", r: "pg", d: "mm" });

    const isUserExists = await service.getUserWithOrOperator([
      { username },
      { email },
    ]);

    if (isUserExists) {
      const conflictField =
        isUserExists.username === username ? "Username" : "E-mail";
      return res.status(409).json({
        status: 409,
        statusText: "Conflict",
        data: {
          message: `${conflictField} is already in use`,
        },
      });
    }

    const user = await service.createUser({ ...body, avatarURL });
    await user.validate();
    user.password = await bCrypt.hash(password, await bCrypt.genSalt(6));
    await user.save();

    res.status(201).json({
      status: 201,
      statusText: "Created",
      data: {
        user: {
          email: user.email,
          subscription: user.subscription,
          avatarURL: user.avatarURL,
        },
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      statusText: "Bad Request",
      data: { message: err.message },
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (Object.keys(req.body).length) {
      const { error } = userLoginSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          status: 400,
          statusText: "Bad Request",
          data: { message: error.message },
        });
      }
    }
    const existingUser = await service.getUser({ email });

    if (
      !existingUser ||
      !(await bCrypt.compare(password, existingUser.password))
    ) {
      console.log("Login failed for email:", email);

      return res.status(401).json({
        status: 401,
        statusText: "Unauthorized",
        data: { message: "Incorrect e-mail or password" },
      });
    }

    const payload = {
      id: existingUser._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const user = await service.updateUser({ email }, { token });

    res.json({
      status: 200,
      statusText: "OK",
      data: {
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      statusText: "Bad Request",
      data: { message: err.message },
    });
  }
};

const logout = async (req, res, next) => {
  try {
    await userLogoutSchema.validateAsync(req.body);
    const { _id } = req.user;
    await service.updateUser({ _id }, { token: null });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({
      status: 400,
      statusText: "Bad Request",
      data: { message: err.message },
    });
  }
};

const getCurrent = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await service.getUser({ _id });

    res.json({
      status: 200,
      statusText: "OK",
      data: {
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    });
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

const setSubscription = async (req, res, next) => {
  try {
    await userSubSchema.validateAsync(req.body);
    const { email } = req.user;
    const { subscription } = req.body;
    await service.updateUser({ email }, { subscription });

    res.json({
      status: 200,
      statusText: "OK",
      data: {
        user: {
          email,
          subscription,
        },
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      statusText: "Bad Request",
      data: { message: err.message },
    });
  }
};
const updateAvatar = async (req, res, next) => {
  try {
    const { user, file } = req;

    const image = await jimp.read(file.path);
    await image.cover(250, 250).write(`${file.destination}/${user._id}.jpg`);

    const updatedUser = await service.updateUser(
      { _id: user._id },
      { avatarURL: `/avatars/${user._id}.jpg` }
    );

    res.json({
      status: 200,
      statusText: "OK",
      data: {
        avatarURL: updatedUser.avatarURL,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      statusText: "Bad Request",
      data: { message: err.message },
    });
  }
};

const usersController = {
  register,
  login,
  logout,
  getCurrent,
  setSubscription,
  updateAvatar,
};

export default usersController;

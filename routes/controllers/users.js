import jwt from "jsonwebtoken";
import bCrypt from "bcryptjs";
import service from "../../services/users.js";

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

    const user = await service.createUser(body);
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
          email: updatedUser.email,
          subscription: updatedUser.subscription,
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

const usersController = {
  register,
  login,
  logout,
  getCurrent,
  setSubscription,
};

export default usersController;

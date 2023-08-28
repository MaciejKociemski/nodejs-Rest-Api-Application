import mongoose from "mongoose";
import request from "supertest";
import app from "../app.js";

import User from "../services/models/users";
import bCrypt from "bcryptjs";

const DATABASE_URL = process.env.DATABASE_URL;

const dummyUser = {
  _id: null,
  email: "ToJesttest@test.com",
  password: "Test12345678",
  subscription: "starter",
};

describe("user login", () => {
  beforeAll(async () => {
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await User.findOneAndDelete({ email: dummyUser.email });
    const { _id } = new User({
      email: dummyUser.email,
      password: await bCrypt.hash(dummyUser.password, await bCrypt.genSalt(6)),
      subscription: dummyUser.subscription,
    }).save();

    dummyUser._id = _id;
  });

  afterAll(async () => {
    await User.findOneAndDelete({ email: dummyUser.email });
    await mongoose.disconnect();
  });

  test("valid data should properly log the user in", async () => {
    console.log("Dummy user before test:", dummyUser);
    const {
      body: {
        status,
        data: { token, user },
      },
    } = await request(app).post("/api/users/login").send({
      email: dummyUser.email,
      password: dummyUser.password,
    });

    expect(status).toBe(200);
    expect(user.email).toBe(dummyUser.email);
    expect(user.subscription).toBe(dummyUser.subscription);
    expect(typeof token).toBe("string");
    expect(token).toBeTruthy();
  });

  test("invalid email should return 401", async () => {
    const {
      body: { status },
    } = await request(app).post("/api/users/login").send({
      email: "wrongEmail@gmail.com",
      password: dummyUser.password,
    });

    expect(status).toBe(401);
  });

  test("broken email should return 400", async () => {
    const {
      body: { status },
    } = await request(app).post("/api/users/login").send({
      email: "123",
      password: dummyUser.password,
    });

    expect(status).toBe(400);
  });
});

import mongoose from "mongoose";
import request from "supertest";
import app from "../app.js";

const DATABASE_URL = process.env.DATABASE_URL;

const sampleLogin = async () => {
  try {
    const res = await request(app).post("/api/users/login").send({
      email: "ToJesttest@test.com",
      password: "Test12345678",
    });

    return res.body;
  } catch (err) {
    throw new Error(err);
  }
};

describe("user login", () => {
  let res;

  beforeAll(async () => {
    try {
      await mongoose.connect(DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (err) {
      throw new Error(err);
    }
  });

  afterAll(async () => {
    try {
      await mongoose.disconnect();
    } catch (err) {
      throw new Error(err);
    }
  });

  beforeEach(async () => {
    res = await sampleLogin();
  });

  test("should return status 200 OK", () => {
    const { status, statusText } = res;
    expect(status).toBe(200);
    expect(statusText).toBe("OK");
  });

  test("should return a token", () => {
    const { token } = res.data;
    expect(typeof token).toBe("string");
    expect(token).toBeTruthy();
  });

  test("should return a user object with valid email and subscription fields", () => {
    const { user } = res.data;

    expect(user).toMatchObject({
      email: expect.any(String),
      subscription: expect.any(String),
    });

    expect(user.email).toBeTruthy();
    expect(user.subscription).toBeTruthy();
  });
});

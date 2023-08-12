import mongoose from "mongoose";
import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 3000; 
const DATABASE_URL = process.env.DATABASE_URL;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connection successful");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
};

connectToDatabase();

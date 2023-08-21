import mongoose from "mongoose";
import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 3000; 
const DATABASE_URL = process.env.DATABASE_URL;

const connection = mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connection
  .then(() => {
    app.listen(PORT, () =>
      console.log(`MongoDB connection successful on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1);
  });
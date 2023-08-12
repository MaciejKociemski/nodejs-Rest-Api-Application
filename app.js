import express from "express";
import morgan from "morgan";
import cors from "cors";
import contactsRouter from "./routes/api/contacts";

const app = express();

const formatLogger = app.get("env") === "development" ? "dev" : "short";

app.use(morgan(formatLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((req, res, next) => {
  res.status(404).json({
    status: 404,
    statusText: "Not Found",
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    status: 500,
    statusText: "Internal Server Error",
    message: err.message,
  });
});

export default app;
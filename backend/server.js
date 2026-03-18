import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/mongoDB.js";
import studentRouter from "./routes/studentRouter.js";
import adminRouter from "./routes/adminRouter.js";

const app = express();

const port = process.env.PORT || 4000;

// Define an array of all allowed frontend URLs
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173", // Student Portal
  "http://localhost:5174", // Admin Portal
].filter(Boolean); // filter(Boolean) removes undefined values if FRONTEND_URL is not set

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());

await connectDB();

app.get("/", (req, res) => {
  res.send("InterConnect API...");
});

app.use("/api/student", studentRouter);
app.use("/api/admin", adminRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

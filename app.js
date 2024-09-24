import express from "express";
import dotenv from "dotenv";
import testimonialRouter from "./routes/testimonialRoutes/testimonialRoute.js";
import authRouter from "./routes/authRoutes/authRoutes.js";
import blogRouter from "./routes/blogRoutes/blogRoute.js";
import propertyRouter from "./routes/propertyRoutes/propertyRoutes.js";
import aboutRouter from "./routes/aboutRoutes/aboutRoutes.js";
import cors from "cors";
import connectDB from "./db/db.js";
import cookieParser from "cookie-parser";

const app = express();

// Dot Env
dotenv.config("./config/config.env");

// Port
const PORT = process.env.PORT;

// URLENCODED
app.use(express.urlencoded({ extended: true }));

// JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["https://propcode-frontenddd.vercel.app"],
    credentials: true,
  })
);

app.use("/public/uploads", express.static("public/uploads"));

// Routes
app.use("/api/testimonials", testimonialRouter);
app.use("/api/auth", authRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/property", propertyRouter);
app.use("/api/about", aboutRouter);

// DataBase
connectDB();

// Create Server
app.listen(PORT, () => {
  console.log(`Server Started on Local Port : ${PORT}`);
});

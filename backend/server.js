import express from "express";
import dotenv from "dotenv";
import cors from "cors"

import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authUserRoutes.js";
import userRoutes from "./src/routes/user.routes.js";
import productRoutes from "./src/routes/product.routes.js";
import dashboardRoutes from "./src/controller/dashboard.controller.js";
import uploadRoutes from "./src/routes/upload.routes.js";
import path from "path";

//Error Handler
import errorHandler from "./src/middleware/error.middleware.js";

dotenv.config();

const app = express();

//cors
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Middleware
app.use(express.json());

// Database Connection
connectDB();

// Serve static files (Uploaded Images)
app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/upload", uploadRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Server is live");
});

app.use(errorHandler)

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import prisma from "./config/prisma.js";
import supabase from "./config/supabase.js";

import routes from "./routes/index.js";
import authRoutes from "./routes/auth.routes.js";
import patientRoutes from "./routes/patient.routes.js";

import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// ================================
// Security
// ================================

app.use(helmet());

// ================================
// CORS
// ================================

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// ================================
// Logging
// ================================

app.use(morgan("dev"));

// ================================
// Body parsing
// ================================

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ================================
// Routes
// ================================

// Authentication
app.use("/api/auth", authRoutes);

// Patient routes
app.use("/api/patient", patientRoutes);

// Other API routes
app.use("/api", routes);

// ================================
// Health check
// ================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MEDIGUIDE API is running",
  });
});

// ================================
// Database test
// ================================

app.get("/api/test-db", async (req, res) => {
  try {
    const userCount = await prisma.user.count();

    res.status(200).json({
      success: true,
      message: "Database connection is working",
      userCount,
    });
  } catch (error) {
    console.error("Database test failed:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

app.use(notFound);
app.use(errorHandler);


export default app;
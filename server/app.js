import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import childRoutes from "./routes/child.routes.js";
import assessmentRoutes from "./routes/assessment.routes.js";
import resourceRoutes from "./routes/resource.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import programRoutes from "./routes/program.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import settingRoutes from "./routes/setting.routes.js";
import sessionRoutes from "./routes/session.routes.js";

dotenv.config();

const app = express();
const isProduction =
  process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
const MONGODB_URI =
  process.env.MONGODB_URI ||
  (!isProduction ? "mongodb://localhost:27017/dounia_center" : null);
const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

if (!MONGODB_URI) {
  throw new Error(
    "MONGODB_URI environment variable is required for production deployments.",
  );
}

let cachedConnectionPromise = null;

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB error:", error);
});

export const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!cachedConnectionPromise) {
    cachedConnectionPromise = mongoose
      .connect(MONGODB_URI)
      .then((connection) => {
        console.log("Connected to MongoDB successfully");
        return connection.connection;
      })
      .catch((error) => {
        cachedConnectionPromise = null;
        console.error("MongoDB connection error:", error.message);
        throw error;
      });
  }

  return cachedConnectionPromise;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ─────────────────────────────────────────────────────────────
   ROUTES
───────────────────────────────────────────────────────────── */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/children", childRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/sessions", sessionRoutes);

/* ─────────────────────────────────────────────────────────────
   HEALTH CHECK
───────────────────────────────────────────────────────────── */
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Dounia Center API is running",
    timestamp: new Date().toISOString(),
  });
});

/* ─────────────────────────────────────────────────────────────
   404 HANDLER
───────────────────────────────────────────────────────────── */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ─────────────────────────────────────────────────────────────
   GLOBAL ERROR HANDLER
───────────────────────────────────────────────────────────── */
app.use((err, req, res, next) => {
  console.error("Error:", err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;

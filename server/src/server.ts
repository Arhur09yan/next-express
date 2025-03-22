import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
// import { PrismaClient } from "@prisma/client"
import dotenv from "dotenv";
import { errorHandler } from "./middleware/error-handler";
import postRoutes from "./routes/post-routes";
// import authRoutes from "./routes/auth-routes";
import { PrismaClient } from ".prisma/client";

// Load environment variables
dotenv.config();

// Initialize Prisma client
export const prisma = new PrismaClient();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/posts", postRoutes);
// app.use("/api/auth", authRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Disconnected from database");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  console.log("Disconnected from database");
  process.exit(0);
});

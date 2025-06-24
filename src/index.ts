import "dotenv/config";
import express, { Express } from "express";
import cors from "cors";
import { connectDB } from "./config/database.config";
import { createServiceLogger } from "./utils/logger.util";
import morganMiddleware from "./middleware/logger.middleware";
import { errorHandler } from "./middleware/error.middleware";
import authRoutes from "./routes/auth.routes";
import vehiclesRoutes from "./routes/vehicles.routes";
import auctionsRoutes from "./routes/auctions.routes";
import usersRoutes from "./routes/users.routes";
import brandsRoutes from "./routes/brands.routes";
import categoriesRoutes from "./routes/categories.routes";

const logger = createServiceLogger("Server");

const app: Express = express();

app.use(morganMiddleware);

app.use(
  cors({
    origin: ["http://localhost:8080", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehiclesRoutes);
app.use("/api/auctions", auctionsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/brands", brandsRoutes);
app.use("/api/categories", categoriesRoutes);

// 404 Handler - must be after all routes
app.use((req, res) => {
  logger.warn("Route not found", {
    url: req.url,
    method: req.method,
  });

  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "Route not found",
      timestamp: new Date().toISOString(),
    },
  });
});

// Global Error Handler - must be last
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
const startServer = async () => {
  try {
    logger.info("Starting server initialization...");
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Server startup error:", error);
    process.exit(1);
  }
};

startServer();

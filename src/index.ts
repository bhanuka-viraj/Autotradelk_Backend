import "dotenv/config";
import express, { Express } from "express";
import cors from "cors";
import { connectDB } from "./config/database";
import logger from "./config/logger";
import morganMiddleware from "./middleware/logger.middleware";
import authRoutes from "./routes/auth.routes";
import vehiclesRoutes from "./routes/vehicles.routes";
import auctionsRoutes from "./routes/auctions.routes";
import usersRoutes from "./routes/users.routes";

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

const PORT = process.env.PORT || 8080;
const startServer = async () => {
  try {
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

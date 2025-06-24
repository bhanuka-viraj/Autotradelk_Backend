import { DataSource } from "typeorm";
import "dotenv/config";
import logger from "./logger";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "autotradelk",
  entities: ["src/entities/*.ts"],
  synchronize: true,
  logging: true,
  ssl: false,
  extra: {
    max: 20,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
  },
});

export const connectDB = async (): Promise<DataSource> => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      logger.info("Database connected successfully");
    }
    return AppDataSource;
  } catch (error) {
    logger.error("Database connection error:", error);
    throw error;
  }
};

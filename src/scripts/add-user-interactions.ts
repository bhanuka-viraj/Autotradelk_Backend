import { AppDataSource } from "../config/database.config";
import { createServiceLogger } from "../utils/logger.util";

const logger = createServiceLogger("AddUserInteractions");

const addUserInteractionsTable = async () => {
  try {
    logger.info("Starting UserInteraction table creation...");

    await AppDataSource.initialize();

    // Create the UserInteraction table
    await AppDataSource.query(`
      CREATE TYPE "interaction_type_enum" AS ENUM ('view', 'search', 'bid', 'favorite', 'compare');
      
      CREATE TABLE IF NOT EXISTS "user_interaction" (
        "id" SERIAL PRIMARY KEY,
        "userId" integer NOT NULL,
        "vehicleId" integer,
        "interactionType" "interaction_type_enum" NOT NULL,
        "metadata" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_user_interaction_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_user_interaction_vehicle" FOREIGN KEY ("vehicleId") REFERENCES "vehicle"("id") ON DELETE CASCADE
      );
      
      CREATE INDEX IF NOT EXISTS "IDX_user_interaction_user_type_created" 
      ON "user_interaction" ("userId", "interactionType", "createdAt");
      
      CREATE INDEX IF NOT EXISTS "IDX_user_interaction_vehicle_type_created" 
      ON "user_interaction" ("vehicleId", "interactionType", "createdAt");
    `);

    logger.info("UserInteraction table created successfully");

    await AppDataSource.destroy();
    logger.info("Database connection closed");
  } catch (error: any) {
    logger.error("Error creating UserInteraction table:", error);
    process.exit(1);
  }
};

addUserInteractionsTable();

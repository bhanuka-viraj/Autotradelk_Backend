import { AppDataSource } from "../config/database.config";
import { createServiceLogger } from "../utils/logger.util";
import { seedLocations } from "../seeds/locations.seed";
import { seedBrands } from "../seeds/brands.seed";
import { seedCategories } from "../seeds/categories.seed";

const logger = createServiceLogger("DatabaseInit");

async function runMigrations() {
  try {
    logger.info("Running database migrations...");

    // Initialize database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    // Run synchronize (in production, use proper migrations)
    if (process.env.NODE_ENV === "production") {
      logger.info("Production environment detected - skipping synchronize");
      // In production, you should use proper migrations instead of synchronize
      // await AppDataSource.runMigrations();
    } else {
      logger.info("Development environment - running synchronize");
      await AppDataSource.synchronize();
    }

    logger.info("Database migrations completed successfully");
  } catch (error) {
    logger.error("Error running migrations:", error);
    throw error;
  }
}

async function seedReferenceData() {
  try {
    logger.info("Seeding reference data...");

    // Seed locations (always needed)
    logger.info("Seeding locations...");
    const locations = await seedLocations();
    logger.info(`Created ${locations.length} locations`);

    // Seed brands (always needed)
    logger.info("Seeding brands...");
    const brands = await seedBrands();
    logger.info(`Created ${brands.length} brands`);

    // Seed categories (always needed)
    logger.info("Seeding categories...");
    const categories = await seedCategories();
    logger.info(`Created ${categories.length} categories`);

    logger.info("Reference data seeding completed successfully");

    return { locations, brands, categories };
  } catch (error) {
    logger.error("Error seeding reference data:", error);
    throw error;
  }
}

async function initializeDatabase() {
  try {
    logger.info("Starting database initialization...");
    logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);

    // Step 1: Run migrations
    await runMigrations();

    // Step 2: Seed reference data (always needed)
    const referenceData = await seedReferenceData();

    logger.info("Database initialization completed successfully!");
    logger.info("Reference data created:", {
      locations: referenceData.locations.length,
      brands: referenceData.brands.length,
      categories: referenceData.categories.length,
    });

    return referenceData;
  } catch (error) {
    logger.error("Database initialization failed:", error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      logger.info("Database initialization script completed");
      // Close connection only when run directly
      if (AppDataSource.isInitialized) {
        AppDataSource.destroy();
      }
      process.exit(0);
    })
    .catch((error) => {
      logger.error("Database initialization script failed:", error);
      // Close connection only when run directly
      if (AppDataSource.isInitialized) {
        AppDataSource.destroy();
      }
      process.exit(1);
    });
}

export { initializeDatabase };

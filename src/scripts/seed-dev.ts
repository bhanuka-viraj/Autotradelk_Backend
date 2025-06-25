import { AppDataSource } from "../config/database.config";
import { createServiceLogger } from "../utils/logger.util";
import { seedLocations } from "../seeds/locations.seed";
import { seedBrands } from "../seeds/brands.seed";
import { seedCategories } from "../seeds/categories.seed";
import { seedUsers } from "../seeds/users.seed";
import { seedVehicles } from "../seeds/vehicles.seed";
import { seedAuctions } from "../seeds/auctions.seed";
import { seedBids } from "../seeds/bids.seed";
import { seedUserInteractions } from "../seeds/user-interactions.seed";

const logger = createServiceLogger("DevSeed");

async function initializeDatabase() {
  try {
    logger.info("Initializing database connection...");

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    // Run synchronize for development
    if (process.env.NODE_ENV !== "production") {
      logger.info("Development environment - running synchronize");
      await AppDataSource.synchronize();
    }

    logger.info("Database connection initialized successfully");
  } catch (error) {
    logger.error("Error initializing database:", error);
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

async function seedTestData(referenceData: any) {
  try {
    logger.info("Seeding test data for development...");

    // Seed test users
    logger.info("Seeding test users...");
    const users = await seedUsers();
    logger.info(`Created ${users.length} test users`);

    // Seed test vehicles
    logger.info("Seeding test vehicles...");
    const vehicles = await seedVehicles(
      referenceData.brands,
      referenceData.categories,
      users,
      referenceData.locations
    );
    logger.info(`Created ${vehicles.length} test vehicles`);

    // Seed test auctions
    logger.info("Seeding test auctions...");
    const auctions = await seedAuctions(
      vehicles,
      users,
      referenceData.locations
    );
    logger.info(`Created ${auctions.length} test auctions`);

    // Seed test bids
    logger.info("Seeding test bids...");
    const bids = await seedBids(auctions, users);
    logger.info(`Created ${bids.length} test bids`);

    // Seed test user interactions
    logger.info("Seeding test user interactions...");
    const interactions = await seedUserInteractions(users, vehicles);
    logger.info(`Created ${interactions.length} test user interactions`);

    logger.info("Test data seeding completed successfully");

    return { users, vehicles, auctions, bids, interactions };
  } catch (error) {
    logger.error("Error seeding test data:", error);
    throw error;
  }
}

async function seedDevelopmentData() {
  try {
    logger.info("Starting development data seeding...");
    logger.info("Environment: development");

    // Step 1: Initialize database connection
    await initializeDatabase();

    // Step 2: Seed reference data
    const referenceData = await seedReferenceData();

    // Step 3: Seed test data
    const testData = await seedTestData(referenceData);

    logger.info("Development data seeding completed successfully!");
    logger.info("Summary:", {
      locations: referenceData.locations.length,
      brands: referenceData.brands.length,
      categories: referenceData.categories.length,
      users: testData.users.length,
      vehicles: testData.vehicles.length,
      auctions: testData.auctions.length,
      bids: testData.bids.length,
      interactions: testData.interactions.length,
    });

    return { referenceData, testData };
  } catch (error) {
    logger.error("Development data seeding failed:", error);
    throw error;
  } finally {
    // Close database connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

// Run if called directly
if (require.main === module) {
  seedDevelopmentData()
    .then(() => {
      logger.info("Development seeding script completed");
      process.exit(0);
    })
    .catch((error) => {
      logger.error("Development seeding script failed:", error);
      process.exit(1);
    });
}

export { seedDevelopmentData };

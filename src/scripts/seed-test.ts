import { AppDataSource } from "../config/database.config";
import { createServiceLogger } from "../utils/logger.util";
import { seedLocations } from "../seeds/locations.seed";
import { seedBrands } from "../seeds/brands.seed";
import { seedCategories } from "../seeds/categories.seed";
import { seedUsers } from "../seeds/users.seed";
import { seedVehicles } from "../seeds/vehicles.seed";
import { seedAuctions } from "../seeds/auctions.seed";
import { seedBids } from "../seeds/bids.seed";

const logger = createServiceLogger("TestSeed");

async function initializeDatabase() {
  try {
    logger.info("Initializing database connection...");

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    // Run synchronize for test environment
    logger.info("Test environment - running synchronize");
    await AppDataSource.synchronize();

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
    logger.info("Seeding minimal test data...");

    // Seed minimal test users (only 2-3 users for testing)
    logger.info("Seeding test users...");
    const users = await seedUsers();
    const testUsers = users.slice(0, 3); // Only use first 3 users
    logger.info(`Created ${testUsers.length} test users`);

    // Seed minimal test vehicles (only 5 vehicles for testing)
    logger.info("Seeding test vehicles...");
    const vehicles = await seedVehicles(
      referenceData.brands,
      referenceData.categories,
      testUsers,
      referenceData.locations
    );
    const testVehicles = vehicles.slice(0, 5); // Only use first 5 vehicles
    logger.info(`Created ${testVehicles.length} test vehicles`);

    // Seed minimal test auctions
    logger.info("Seeding test auctions...");
    const auctions = await seedAuctions(
      testVehicles,
      testUsers,
      referenceData.locations
    );
    const testAuctions = auctions.slice(0, 3); // Only use first 3 auctions
    logger.info(`Created ${testAuctions.length} test auctions`);

    // Seed minimal test bids
    logger.info("Seeding test bids...");
    const bids = await seedBids(testAuctions, testUsers);
    const testBids = bids.slice(0, 5); // Only use first 5 bids
    logger.info(`Created ${testBids.length} test bids`);

    logger.info("Test data seeding completed successfully");

    return {
      users: testUsers,
      vehicles: testVehicles,
      auctions: testAuctions,
      bids: testBids,
    };
  } catch (error) {
    logger.error("Error seeding test data:", error);
    throw error;
  }
}

async function seedTestEnvironment() {
  try {
    logger.info("Starting test environment seeding...");
    logger.info("Environment: test");

    // Step 1: Initialize database connection
    await initializeDatabase();

    // Step 2: Seed reference data
    const referenceData = await seedReferenceData();

    // Step 3: Seed minimal test data
    const testData = await seedTestData(referenceData);

    logger.info("Test environment seeding completed successfully!");
    logger.info("Summary:", {
      locations: referenceData.locations.length,
      brands: referenceData.brands.length,
      categories: referenceData.categories.length,
      users: testData.users.length,
      vehicles: testData.vehicles.length,
      auctions: testData.auctions.length,
      bids: testData.bids.length,
    });

    return { referenceData, testData };
  } catch (error) {
    logger.error("Test environment seeding failed:", error);
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
  seedTestEnvironment()
    .then(() => {
      logger.info("Test seeding script completed");
      process.exit(0);
    })
    .catch((error) => {
      logger.error("Test seeding script failed:", error);
      process.exit(1);
    });
}

export { seedTestEnvironment };

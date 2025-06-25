import { AppDataSource } from "../config/database.config";
import { createServiceLogger } from "../utils/logger.util";
import { seedLocations } from "../seeds/locations.seed";
import { seedBrands } from "../seeds/brands.seed";
import { seedCategories } from "../seeds/categories.seed";
import { User } from "../entities/User";
import bcrypt from "bcrypt";

const logger = createServiceLogger("ProdSeed");

async function initializeDatabase() {
  try {
    logger.info("Initializing database connection...");

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    // In production, don't use synchronize
    logger.info("Production environment - skipping synchronize");

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

async function createAdminUsers() {
  try {
    logger.info("Creating admin users...");

    const userRepository = AppDataSource.getRepository(User);

    // Check if admin users already exist
    const existingAdmin = await userRepository.findOne({
      where: { email: "admin@autotradelk.com" },
    });

    if (existingAdmin) {
      logger.info("Admin user already exists, skipping creation");
      return [existingAdmin];
    }

    // Create admin user
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminUser = userRepository.create({
      name: "System Administrator",
      email: "admin@autotradelk.com",
      password: hashedPassword,
      phone: "+94 11 123 4567",
      role: "admin",
      isVerified: true,
      isActive: true,
    });

    await userRepository.save(adminUser);
    logger.info("Admin user created successfully");

    return [adminUser];
  } catch (error) {
    logger.error("Error creating admin users:", error);
    throw error;
  }
}

async function seedProductionData() {
  try {
    logger.info("Starting production data seeding...");
    logger.info("Environment: production");

    // Step 1: Initialize database connection
    await initializeDatabase();

    // Step 2: Seed reference data
    const referenceData = await seedReferenceData();

    // Step 3: Create admin users
    const adminUsers = await createAdminUsers();

    logger.info("Production data seeding completed successfully!");
    logger.info("Summary:", {
      locations: referenceData.locations.length,
      brands: referenceData.brands.length,
      categories: referenceData.categories.length,
      adminUsers: adminUsers.length,
    });

    // Log admin credentials (only in production logs)
    if (adminUsers.length > 0) {
      logger.info("Admin user created:", {
        email: "admin@autotradelk.com",
        password: "Check environment variables or use default: Admin@123",
      });
    }

    return { referenceData, adminUsers };
  } catch (error) {
    logger.error("Production data seeding failed:", error);
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
  seedProductionData()
    .then(() => {
      logger.info("Production seeding script completed");
      process.exit(0);
    })
    .catch((error) => {
      logger.error("Production seeding script failed:", error);
      process.exit(1);
    });
}

export { seedProductionData };

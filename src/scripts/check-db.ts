import { AppDataSource } from "../config/database.config";
import { createServiceLogger } from "../utils/logger.util";
import { Location } from "../entities/Location";
import { Brand } from "../entities/Brand";
import { Category } from "../entities/Category";
import { User } from "../entities/User";
import { Vehicle } from "../entities/Vehicle";
import { Auction } from "../entities/Auction";

const logger = createServiceLogger("DatabaseCheck");

interface DatabaseStats {
  locations: number;
  brands: number;
  categories: number;
  users: number;
  vehicles: number;
  auctions: number;
  connection: boolean;
  migrations: boolean;
}

async function checkDatabaseConnection(): Promise<boolean> {
  try {
    logger.info("Checking database connection...");

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    // Test the connection
    await AppDataSource.query("SELECT 1");
    logger.info("Database connection successful");
    return true;
  } catch (error) {
    logger.error("Database connection failed:", error);
    return false;
  }
}

async function checkMigrations(): Promise<boolean> {
  try {
    logger.info("Checking database migrations...");

    // Check if tables exist
    const tables = await AppDataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('locations', 'brands', 'categories', 'users', 'vehicles', 'auctions')
    `);

    const expectedTables = [
      "locations",
      "brands",
      "categories",
      "users",
      "vehicles",
      "auctions",
    ];
    const existingTables = tables.map((t: any) => t.table_name);

    const missingTables = expectedTables.filter(
      (table) => !existingTables.includes(table)
    );

    if (missingTables.length > 0) {
      logger.warn("Missing tables:", missingTables);
      return false;
    }

    logger.info("All required tables exist");
    return true;
  } catch (error) {
    logger.error("Error checking migrations:", error);
    return false;
  }
}

async function getTableStats(): Promise<Partial<DatabaseStats>> {
  try {
    logger.info("Getting table statistics...");

    const locationRepo = AppDataSource.getRepository(Location);
    const brandRepo = AppDataSource.getRepository(Brand);
    const categoryRepo = AppDataSource.getRepository(Category);
    const userRepo = AppDataSource.getRepository(User);
    const vehicleRepo = AppDataSource.getRepository(Vehicle);
    const auctionRepo = AppDataSource.getRepository(Auction);

    const [locations, brands, categories, users, vehicles, auctions] =
      await Promise.all([
        locationRepo.count(),
        brandRepo.count(),
        categoryRepo.count(),
        userRepo.count(),
        vehicleRepo.count(),
        auctionRepo.count(),
      ]);

    return {
      locations,
      brands,
      categories,
      users,
      vehicles,
      auctions,
    };
  } catch (error) {
    logger.error("Error getting table stats:", error);
    return {};
  }
}

async function checkDataIntegrity(): Promise<void> {
  try {
    logger.info("Checking data integrity...");

    // Check for orphaned records
    const orphanedVehicles = await AppDataSource.query(`
      SELECT COUNT(*) as count 
      FROM vehicles v 
      LEFT JOIN brands b ON v."brandId" = b.id 
      WHERE b.id IS NULL
    `);

    const orphanedAuctions = await AppDataSource.query(`
      SELECT COUNT(*) as count 
      FROM auctions a 
      LEFT JOIN vehicles v ON a."vehicleId" = v.id 
      WHERE v.id IS NULL
    `);

    if (orphanedVehicles[0].count > 0) {
      logger.warn(
        `Found ${orphanedVehicles[0].count} vehicles with invalid brand references`
      );
    }

    if (orphanedAuctions[0].count > 0) {
      logger.warn(
        `Found ${orphanedAuctions[0].count} auctions with invalid vehicle references`
      );
    }

    logger.info("Data integrity check completed");
  } catch (error) {
    logger.error("Error checking data integrity:", error);
  }
}

async function checkDatabase(): Promise<DatabaseStats> {
  try {
    logger.info("Starting database health check...");

    const connection = await checkDatabaseConnection();
    const migrations = await checkMigrations();
    const stats = await getTableStats();

    if (connection && migrations) {
      await checkDataIntegrity();
    }

    const result: DatabaseStats = {
      connection,
      migrations,
      locations: stats.locations || 0,
      brands: stats.brands || 0,
      categories: stats.categories || 0,
      users: stats.users || 0,
      vehicles: stats.vehicles || 0,
      auctions: stats.auctions || 0,
    };

    logger.info("Database health check completed:", result);

    return result;
  } catch (error) {
    logger.error("Database health check failed:", error);
    throw error;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

// Run if called directly
if (require.main === module) {
  checkDatabase()
    .then((stats) => {
      logger.info("Database check completed successfully");
      console.table(stats);
      process.exit(stats.connection && stats.migrations ? 0 : 1);
    })
    .catch((error) => {
      logger.error("Database check failed:", error);
      process.exit(1);
    });
}

export { checkDatabase };

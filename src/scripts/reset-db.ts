import { DataSource } from "typeorm";
import "dotenv/config";

async function resetDatabase() {
  try {
    console.log("Starting database reset...");


    const postgresDataSource = new DataSource({
      type: "postgres",
      host: process.env.DB_HOST || "95.111.248.142",
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      database: "postgres", 
      ssl: false,
    });

    await postgresDataSource.initialize();
    console.log("Connected to postgres database");

    try {
      await postgresDataSource.query("DROP DATABASE IF EXISTS autotradelk");
      console.log("Dropped autotradelk database");
    } catch (error) {
      console.log("Database might not exist or there are active connections");
    }


    await postgresDataSource.query("CREATE DATABASE autotradelk");
    console.log("Created autotradelk database");

    await postgresDataSource.destroy();
    console.log("Database reset completed successfully!");
  } catch (error) {
    console.error("Error resetting database:", error);
  }
}

resetDatabase();

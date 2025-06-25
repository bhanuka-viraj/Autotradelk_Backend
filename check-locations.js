const { Client } = require("pg");
require("dotenv").config();

async function checkLocations() {
  const client = new Client({
    host: process.env.DB_HOST || "95.111.248.142",
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: "autotradelk",
    ssl: false,
  });

  try {
    await client.connect();
    console.log("Connected to database");

    // Print all locations with details
    const allQuery = `SELECT "id", "name", "type", "code", "parentId", "sortOrder" FROM locations ORDER BY "id";`;
    const allResult = await client.query(allQuery);
    console.log("All locations:");
    console.table(allResult.rows);

    // Also check total count
    const countResult = await client.query("SELECT COUNT(*) FROM locations");
    console.log(`Total locations: ${countResult.rows[0].count}`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.end();
  }
}

checkLocations();

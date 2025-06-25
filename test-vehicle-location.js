const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "autotradelk",
  user: "postgres",
  password: "postgres",
});

async function testVehicleLocation() {
  try {
    console.log("Checking vehicles...");

    // Get vehicles
    const vehiclesResult = await pool.query(
      'SELECT id, title, "locationId" FROM vehicle LIMIT 5'
    );
    console.log("Current vehicles:");
    vehiclesResult.rows.forEach((row) => {
      console.log(
        `ID: ${row.id}, Title: ${row.title}, LocationID: ${row.locationId}`
      );
    });

    // Update vehicle 1 to use Colombo 7 (area) which has hierarchy
    console.log("\nUpdating vehicle 1 to use Colombo 7 (location ID 10)...");
    await pool.query('UPDATE vehicle SET "locationId" = 10 WHERE id = 1');

    console.log("Vehicle updated successfully!");

    // Check the location hierarchy for Colombo 7
    console.log("\nLocation hierarchy for Colombo 7:");
    const locationResult = await pool.query(`
      SELECT 
        l1.id as area_id, l1.name as area_name, l1.type as area_type,
        l2.id as city_id, l2.name as city_name, l2.type as city_type,
        l3.id as district_id, l3.name as district_name, l3.type as district_type,
        l4.id as province_id, l4.name as province_name, l4.type as province_type
      FROM locations l1
      LEFT JOIN locations l2 ON l1.parentId = l2.id
      LEFT JOIN locations l3 ON l2.parentId = l3.id
      LEFT JOIN locations l4 ON l3.parentId = l4.id
      WHERE l1.id = 10
    `);

    if (locationResult.rows.length > 0) {
      const loc = locationResult.rows[0];
      console.log(`Area: ${loc.area_name} (${loc.area_type})`);
      console.log(`City: ${loc.city_name} (${loc.city_type})`);
      console.log(`District: ${loc.district_name} (${loc.district_type})`);
      console.log(`Province: ${loc.province_name} (${loc.province_type})`);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await pool.end();
  }
}

testVehicleLocation();

const { Client } = require("pg");
require("dotenv/config");

const client = new Client({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "autotradelk",
});

async function testVehicleUpdate() {
  try {
    console.log("Testing vehicle location hierarchy...\n");

    await client.connect();
    console.log("Connected to database successfully!\n");

    // Test 1: Check vehicle location
    console.log("1. Checking vehicle location:");
    const vehicleResult = await client.query(
      'SELECT id, title, "locationId" FROM vehicle WHERE id = 1'
    );

    if (vehicleResult.rows.length > 0) {
      const vehicle = vehicleResult.rows[0];
      console.log(`Vehicle: ${vehicle.title}`);
      console.log(`Location ID: ${vehicle.locationId}`);
    }
    console.log();

    // Test 2: Check what location ID 10 is
    console.log("2. Checking location ID 10:");
    const locationResult = await client.query(
      "SELECT id, name, type FROM locations WHERE id = 10"
    );

    if (locationResult.rows.length > 0) {
      const location = locationResult.rows[0];
      console.log(`Location: ${location.name} (${location.type})`);
    }
    console.log();

    // Test 3: Check the complete hierarchy for location 10
    console.log("3. Checking complete hierarchy for location 10:");
    const hierarchyResult = await client.query(`
      SELECT 
        l1.id as area_id, l1.name as area_name, l1.type as area_type,
        l2.id as city_id, l2.name as city_name, l2.type as city_type,
        l3.id as district_id, l3.name as district_name, l3.type as district_type,
        l4.id as province_id, l4.name as province_name, l4.type as province_type
      FROM locations l1
      LEFT JOIN locations l2 ON l1."parentId" = l2.id
      LEFT JOIN locations l3 ON l2."parentId" = l3.id
      LEFT JOIN locations l4 ON l3."parentId" = l4.id
      WHERE l1.id = 10
    `);

    if (hierarchyResult.rows.length > 0) {
      const loc = hierarchyResult.rows[0];
      console.log(`Area: ${loc.area_name} (${loc.area_type})`);
      console.log(`City: ${loc.city_name} (${loc.city_type})`);
      console.log(`District: ${loc.district_name} (${loc.district_type})`);
      console.log(`Province: ${loc.province_name} (${loc.province_type})`);
    }
    console.log();

    // Test 4: Check all areas in Colombo City
    console.log("4. Checking all areas in Colombo City:");
    const areasResult = await client.query(`
      SELECT l1.id, l1.name, l1.type
      FROM locations l1
      LEFT JOIN locations l2 ON l1."parentId" = l2.id
      WHERE l1.type = 'area' AND l2.name = 'Colombo City'
      ORDER BY l1.sortOrder, l1.name
    `);

    console.log(`Found ${areasResult.rows.length} areas in Colombo City:`);
    areasResult.rows.forEach((area, index) => {
      console.log(`  ${index + 1}. ${area.name} (ID: ${area.id})`);
    });
    console.log();

    // Test 5: Check all areas in Western Province
    console.log("5. Checking all areas in Western Province:");
    const provinceAreasResult = await client.query(`
      SELECT l1.id, l1.name, l1.type
      FROM locations l1
      LEFT JOIN locations l2 ON l1."parentId" = l2.id
      LEFT JOIN locations l3 ON l2."parentId" = l3.id
      LEFT JOIN locations l4 ON l3."parentId" = l4.id
      WHERE l1.type = 'area' AND l4.name = 'Western Province'
      ORDER BY l1.sortOrder, l1.name
      LIMIT 10
    `);

    console.log(
      `Found ${provinceAreasResult.rows.length} areas in Western Province (showing first 10):`
    );
    provinceAreasResult.rows.forEach((area, index) => {
      console.log(`  ${index + 1}. ${area.name} (ID: ${area.id})`);
    });

    console.log("\n🎉 Vehicle location hierarchy test completed successfully!");
    console.log(
      "\n📝 Note: When you call GET /api/vehicles/:id, the response will include:"
    );
    console.log("   - Area (e.g., Colombo 7)");
    console.log("   - City (e.g., Colombo City)");
    console.log("   - District (e.g., Colombo)");
    console.log("   - Province (e.g., Western Province)");
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await client.end();
  }
}

testVehicleUpdate();

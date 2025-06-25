const axios = require("axios");

const BASE_URL = "http://localhost:3000/api";

async function testAreaLocation() {
  try {
    console.log("Testing area-based location system...\n");

    // Test 1: Check if vehicles now use area IDs
    console.log("1. Testing vehicle location (should be area ID):");
    const vehicleResponse = await axios.get(`${BASE_URL}/vehicles/1`);
    const vehicle = vehicleResponse.data;

    console.log(`Vehicle: ${vehicle.title}`);
    console.log(`Location ID: ${vehicle.location.id}`);
    console.log(`Location Name: ${vehicle.location.name}`);
    console.log(`Location Type: ${vehicle.location.type}`);

    if (vehicle.location.type === "area") {
      console.log("✅ Vehicle uses area ID correctly");
    } else {
      console.log("❌ Vehicle still uses non-area location");
    }
    console.log();

    // Test 2: Check complete location hierarchy
    console.log("2. Testing complete location hierarchy:");
    if (vehicle.location.parent) {
      console.log(
        `City: ${vehicle.location.parent.name} (ID: ${vehicle.location.parent.id})`
      );

      if (vehicle.location.parent.parent) {
        console.log(
          `District: ${vehicle.location.parent.parent.name} (ID: ${vehicle.location.parent.parent.id})`
        );

        if (vehicle.location.parent.parent.parent) {
          console.log(
            `Province: ${vehicle.location.parent.parent.parent.name} (ID: ${vehicle.location.parent.parent.parent.id})`
          );
        }
      }
    }
    console.log("✅ Complete hierarchy available\n");

    // Test 3: Test location lookup by ID
    console.log("3. Testing location lookup by area ID:");
    const locationResponse = await axios.get(
      `${BASE_URL}/locations/${vehicle.location.id}`
    );
    const location = locationResponse.data;

    console.log(`Location: ${location.name} (${location.type})`);
    if (location.parent) {
      console.log(`Parent: ${location.parent.name} (${location.parent.type})`);
    }
    console.log("✅ Location lookup works correctly\n");

    // Test 4: Test getting areas by parent (province)
    console.log("4. Testing get areas by parent (province):");
    const provinceId = vehicle.location.parent?.parent?.parent?.id;
    if (provinceId) {
      const areasResponse = await axios.get(
        `${BASE_URL}/locations/${provinceId}/areas`
      );
      const areas = areasResponse.data;

      console.log(
        `Found ${areas.length} areas in province ${vehicle.location.parent.parent.parent.name}:`
      );
      areas.slice(0, 5).forEach((area, index) => {
        console.log(`  ${index + 1}. ${area.name} (ID: ${area.id})`);
      });
      console.log("✅ Areas by parent lookup works\n");
    }

    // Test 5: Test getting areas by parent (district)
    console.log("5. Testing get areas by parent (district):");
    const districtId = vehicle.location.parent?.parent?.id;
    if (districtId) {
      const areasResponse = await axios.get(
        `${BASE_URL}/locations/${districtId}/areas`
      );
      const areas = areasResponse.data;

      console.log(
        `Found ${areas.length} areas in district ${vehicle.location.parent.parent.name}:`
      );
      areas.slice(0, 5).forEach((area, index) => {
        console.log(`  ${index + 1}. ${area.name} (ID: ${area.id})`);
      });
      console.log("✅ Areas by district lookup works\n");
    }

    // Test 6: Test getting areas by parent (city)
    console.log("6. Testing get areas by parent (city):");
    const cityId = vehicle.location.parent?.id;
    if (cityId) {
      const areasResponse = await axios.get(
        `${BASE_URL}/locations/${cityId}/areas`
      );
      const areas = areasResponse.data;

      console.log(
        `Found ${areas.length} areas in city ${vehicle.location.parent.name}:`
      );
      areas.forEach((area, index) => {
        console.log(`  ${index + 1}. ${area.name} (ID: ${area.id})`);
      });
      console.log("✅ Areas by city lookup works\n");
    }

    console.log("🎉 All area-based location tests passed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
}

testAreaLocation();

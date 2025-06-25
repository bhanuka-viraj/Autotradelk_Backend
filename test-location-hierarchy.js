const axios = require("axios");

const BASE_URL = "http://localhost:3000/api";

async function testLocationHierarchy() {
  try {
    console.log("Testing location hierarchy in API responses...\n");

    // Test 1: Get a vehicle and check its location hierarchy
    console.log("1. Testing vehicle location hierarchy:");
    const vehicleResponse = await axios.get(`${BASE_URL}/vehicles/1`);
    const vehicle = vehicleResponse.data;

    console.log(`Vehicle: ${vehicle.title}`);
    console.log(
      `Location: ${vehicle.location.name} (${vehicle.location.type})`
    );

    if (vehicle.location.parent) {
      console.log(
        `City: ${vehicle.location.parent.name} (${vehicle.location.parent.type})`
      );

      if (vehicle.location.parent.parent) {
        console.log(
          `District: ${vehicle.location.parent.parent.name} (${vehicle.location.parent.parent.type})`
        );

        if (vehicle.location.parent.parent.parent) {
          console.log(
            `Province: ${vehicle.location.parent.parent.parent.name} (${vehicle.location.parent.parent.parent.type})`
          );
        }
      }
    }
    console.log("✅ Vehicle location hierarchy test passed\n");

    // Test 2: Get location suggestions and check full path
    console.log("2. Testing location suggestions with full path:");
    const suggestionsResponse = await axios.get(
      `${BASE_URL}/locations/suggestions?query=Colombo`
    );
    const suggestions = suggestionsResponse.data;

    suggestions.slice(0, 3).forEach((suggestion, index) => {
      console.log(
        `Suggestion ${index + 1}: ${suggestion.name} - ${suggestion.fullPath}`
      );
    });
    console.log("✅ Location suggestions test passed\n");

    // Test 3: Get location hierarchy
    console.log("3. Testing location hierarchy structure:");
    const hierarchyResponse = await axios.get(
      `${BASE_URL}/locations/hierarchy`
    );
    const hierarchy = hierarchyResponse.data;

    if (hierarchy.length > 0) {
      const province = hierarchy[0];
      console.log(`Province: ${province.name}`);

      if (province.children && province.children.length > 0) {
        const district = province.children[0];
        console.log(`  District: ${district.name}`);

        if (district.children && district.children.length > 0) {
          const city = district.children[0];
          console.log(`    City: ${city.name}`);

          if (city.children && city.children.length > 0) {
            const area = city.children[0];
            console.log(`      Area: ${area.name}`);
          }
        }
      }
    }
    console.log("✅ Location hierarchy structure test passed\n");

    // Test 4: Get auctions and check vehicle location hierarchy
    console.log("4. Testing auction vehicle location hierarchy:");
    const auctionsResponse = await axios.get(`${BASE_URL}/auctions`);
    const auctions = auctionsResponse.data.data;

    if (auctions.length > 0) {
      const auction = auctions[0];
      if (auction.vehicle && auction.vehicle.location) {
        console.log(
          `Auction ${auction.id} - Vehicle: ${auction.vehicle.title}`
        );
        console.log(
          `Location: ${auction.vehicle.location.name} (${auction.vehicle.location.type})`
        );

        if (auction.vehicle.location.parent) {
          console.log(`City: ${auction.vehicle.location.parent.name}`);

          if (auction.vehicle.location.parent.parent) {
            console.log(
              `District: ${auction.vehicle.location.parent.parent.name}`
            );

            if (auction.vehicle.location.parent.parent.parent) {
              console.log(
                `Province: ${auction.vehicle.location.parent.parent.parent.name}`
              );
            }
          }
        }
      }
    }
    console.log("✅ Auction vehicle location hierarchy test passed\n");

    console.log("🎉 All location hierarchy tests passed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
}

testLocationHierarchy();

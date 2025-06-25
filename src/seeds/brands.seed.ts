import { AppDataSource } from "../config/database.config";
import { Brand } from "../entities/Brand";
import { createServiceLogger } from "../utils/logger.util";

const logger = createServiceLogger("BrandsSeed");

export async function seedBrands(): Promise<Brand[]> {
  try {
    logger.info("Starting brands seeding...");

    const brandRepository = AppDataSource.getRepository(Brand);

    // Check if brands already exist
    const existingCount = await brandRepository.count();
    if (existingCount > 0) {
      logger.info(
        `Brands already exist (${existingCount} brands), skipping seeding`
      );
      return await brandRepository.find();
    }

    const brands = [
      { name: "toyota", displayName: "Toyota", countryOfOrigin: "Japan" },
      { name: "honda", displayName: "Honda", countryOfOrigin: "Japan" },
      { name: "bmw", displayName: "BMW", countryOfOrigin: "Germany" },
      {
        name: "mercedes",
        displayName: "Mercedes-Benz",
        countryOfOrigin: "Germany",
      },
      { name: "audi", displayName: "Audi", countryOfOrigin: "Germany" },
      {
        name: "volkswagen",
        displayName: "Volkswagen",
        countryOfOrigin: "Germany",
      },
      { name: "ford", displayName: "Ford", countryOfOrigin: "USA" },
      { name: "chevrolet", displayName: "Chevrolet", countryOfOrigin: "USA" },
      { name: "nissan", displayName: "Nissan", countryOfOrigin: "Japan" },
      { name: "mazda", displayName: "Mazda", countryOfOrigin: "Japan" },
      { name: "subaru", displayName: "Subaru", countryOfOrigin: "Japan" },
      {
        name: "mitsubishi",
        displayName: "Mitsubishi",
        countryOfOrigin: "Japan",
      },
      { name: "lexus", displayName: "Lexus", countryOfOrigin: "Japan" },
      { name: "infiniti", displayName: "Infiniti", countryOfOrigin: "Japan" },
      { name: "acura", displayName: "Acura", countryOfOrigin: "Japan" },
      {
        name: "hyundai",
        displayName: "Hyundai",
        countryOfOrigin: "South Korea",
      },
      { name: "kia", displayName: "Kia", countryOfOrigin: "South Korea" },
      { name: "volvo", displayName: "Volvo", countryOfOrigin: "Sweden" },
      { name: "saab", displayName: "Saab", countryOfOrigin: "Sweden" },
      { name: "peugeot", displayName: "Peugeot", countryOfOrigin: "France" },
      { name: "renault", displayName: "Renault", countryOfOrigin: "France" },
      { name: "citroen", displayName: "Citroën", countryOfOrigin: "France" },
      { name: "fiat", displayName: "Fiat", countryOfOrigin: "Italy" },
      {
        name: "alfa-romeo",
        displayName: "Alfa Romeo",
        countryOfOrigin: "Italy",
      },
      { name: "ferrari", displayName: "Ferrari", countryOfOrigin: "Italy" },
      {
        name: "lamborghini",
        displayName: "Lamborghini",
        countryOfOrigin: "Italy",
      },
      { name: "maserati", displayName: "Maserati", countryOfOrigin: "Italy" },
      { name: "porsche", displayName: "Porsche", countryOfOrigin: "Germany" },
      { name: "jaguar", displayName: "Jaguar", countryOfOrigin: "UK" },
      { name: "land-rover", displayName: "Land Rover", countryOfOrigin: "UK" },
      { name: "mini", displayName: "MINI", countryOfOrigin: "UK" },
      { name: "bentley", displayName: "Bentley", countryOfOrigin: "UK" },
      {
        name: "rolls-royce",
        displayName: "Rolls-Royce",
        countryOfOrigin: "UK",
      },
      {
        name: "aston-martin",
        displayName: "Aston Martin",
        countryOfOrigin: "UK",
      },
      { name: "mclaren", displayName: "McLaren", countryOfOrigin: "UK" },
      { name: "lotus", displayName: "Lotus", countryOfOrigin: "UK" },
      { name: "tata", displayName: "Tata", countryOfOrigin: "India" },
      { name: "mahindra", displayName: "Mahindra", countryOfOrigin: "India" },
      {
        name: "maruti-suzuki",
        displayName: "Maruti Suzuki",
        countryOfOrigin: "India",
      },
      {
        name: "honda-cars",
        displayName: "Honda Cars",
        countryOfOrigin: "India",
      },
      {
        name: "toyota-kirloskar",
        displayName: "Toyota Kirloskar",
        countryOfOrigin: "India",
      },
      {
        name: "hyundai-motor",
        displayName: "Hyundai Motor",
        countryOfOrigin: "India",
      },
      {
        name: "kia-motors",
        displayName: "Kia Motors",
        countryOfOrigin: "India",
      },
      { name: "mg-motor", displayName: "MG Motor", countryOfOrigin: "India" },
      {
        name: "volkswagen-india",
        displayName: "Volkswagen India",
        countryOfOrigin: "India",
      },
      {
        name: "skoda",
        displayName: "Škoda",
        countryOfOrigin: "Czech Republic",
      },
      { name: "seat", displayName: "SEAT", countryOfOrigin: "Spain" },
      { name: "opel", displayName: "Opel", countryOfOrigin: "Germany" },
      { name: "dacia", displayName: "Dacia", countryOfOrigin: "Romania" },
      { name: "lada", displayName: "Lada", countryOfOrigin: "Russia" },
      { name: "uaz", displayName: "UAZ", countryOfOrigin: "Russia" },
      { name: "gaz", displayName: "GAZ", countryOfOrigin: "Russia" },
      { name: "zaz", displayName: "ZAZ", countryOfOrigin: "Ukraine" },
      { name: "daihatsu", displayName: "Daihatsu", countryOfOrigin: "Japan" },
      { name: "suzuki", displayName: "Suzuki", countryOfOrigin: "Japan" },
      { name: "isuzu", displayName: "Isuzu", countryOfOrigin: "Japan" },
      { name: "datsun", displayName: "Datsun", countryOfOrigin: "Japan" },
      {
        name: "mitsubishi-fuso",
        displayName: "Mitsubishi Fuso",
        countryOfOrigin: "Japan",
      },
      { name: "hino", displayName: "Hino", countryOfOrigin: "Japan" },
      { name: "ud-trucks", displayName: "UD Trucks", countryOfOrigin: "Japan" },
      { name: "scania", displayName: "Scania", countryOfOrigin: "Sweden" },
      { name: "man", displayName: "MAN", countryOfOrigin: "Germany" },
      { name: "iveco", displayName: "Iveco", countryOfOrigin: "Italy" },
      { name: "daf", displayName: "DAF", countryOfOrigin: "Netherlands" },
      {
        name: "renault-trucks",
        displayName: "Renault Trucks",
        countryOfOrigin: "France",
      },
      {
        name: "volvo-trucks",
        displayName: "Volvo Trucks",
        countryOfOrigin: "Sweden",
      },
      {
        name: "mercedes-benz-trucks",
        displayName: "Mercedes-Benz Trucks",
        countryOfOrigin: "Germany",
      },
      { name: "peterbilt", displayName: "Peterbilt", countryOfOrigin: "USA" },
      { name: "kenworth", displayName: "Kenworth", countryOfOrigin: "USA" },
      {
        name: "freightliner",
        displayName: "Freightliner",
        countryOfOrigin: "USA",
      },
      { name: "mack", displayName: "Mack", countryOfOrigin: "USA" },
      {
        name: "western-star",
        displayName: "Western Star",
        countryOfOrigin: "USA",
      },
      {
        name: "international",
        displayName: "International",
        countryOfOrigin: "USA",
      },
      { name: "navistar", displayName: "Navistar", countryOfOrigin: "USA" },
      { name: "autocar", displayName: "Autocar", countryOfOrigin: "USA" },
      { name: "white", displayName: "White", countryOfOrigin: "USA" },
      { name: "sterling", displayName: "Sterling", countryOfOrigin: "USA" },
      { name: "dodge", displayName: "Dodge", countryOfOrigin: "USA" },
      { name: "chrysler", displayName: "Chrysler", countryOfOrigin: "USA" },
      { name: "jeep", displayName: "Jeep", countryOfOrigin: "USA" },
      { name: "ram", displayName: "RAM", countryOfOrigin: "USA" },
      { name: "cadillac", displayName: "Cadillac", countryOfOrigin: "USA" },
      { name: "buick", displayName: "Buick", countryOfOrigin: "USA" },
      { name: "pontiac", displayName: "Pontiac", countryOfOrigin: "USA" },
      { name: "oldsmobile", displayName: "Oldsmobile", countryOfOrigin: "USA" },
      { name: "saturn", displayName: "Saturn", countryOfOrigin: "USA" },
      { name: "hummer", displayName: "Hummer", countryOfOrigin: "USA" },
      { name: "plymouth", displayName: "Plymouth", countryOfOrigin: "USA" },
      { name: "eagle", displayName: "Eagle", countryOfOrigin: "USA" },
      { name: "amc", displayName: "AMC", countryOfOrigin: "USA" },
      { name: "studebaker", displayName: "Studebaker", countryOfOrigin: "USA" },
      { name: "packard", displayName: "Packard", countryOfOrigin: "USA" },
      { name: "nash", displayName: "Nash", countryOfOrigin: "USA" },
      { name: "hudson", displayName: "Hudson", countryOfOrigin: "USA" },
      { name: "willys", displayName: "Willys", countryOfOrigin: "USA" },
      { name: "kaiser", displayName: "Kaiser", countryOfOrigin: "USA" },
      { name: "frazer", displayName: "Frazer", countryOfOrigin: "USA" },
      { name: "gmc", displayName: "GMC", countryOfOrigin: "USA" },
      {
        name: "chevrolet-trucks",
        displayName: "Chevrolet Trucks",
        countryOfOrigin: "USA",
      },
      {
        name: "ford-trucks",
        displayName: "Ford Trucks",
        countryOfOrigin: "USA",
      },
      { name: "lincoln", displayName: "Lincoln", countryOfOrigin: "USA" },
      { name: "mercury", displayName: "Mercury", countryOfOrigin: "USA" },
      { name: "edsel", displayName: "Edsel", countryOfOrigin: "USA" },
      {
        name: "continental",
        displayName: "Continental",
        countryOfOrigin: "USA",
      },
      { name: "mark", displayName: "Mark", countryOfOrigin: "USA" },
      {
        name: "thunderbird",
        displayName: "Thunderbird",
        countryOfOrigin: "USA",
      },
      { name: "falcon", displayName: "Falcon", countryOfOrigin: "USA" },
      { name: "fairlane", displayName: "Fairlane", countryOfOrigin: "USA" },
      { name: "galaxie", displayName: "Galaxie", countryOfOrigin: "USA" },
      { name: "torino", displayName: "Torino", countryOfOrigin: "USA" },
      { name: "maverick", displayName: "Maverick", countryOfOrigin: "USA" },
      { name: "pinto", displayName: "Pinto", countryOfOrigin: "USA" },
      { name: "mustang", displayName: "Mustang", countryOfOrigin: "USA" },
      { name: "bronco", displayName: "Bronco", countryOfOrigin: "USA" },
      { name: "ranger", displayName: "Ranger", countryOfOrigin: "USA" },
      { name: "explorer", displayName: "Explorer", countryOfOrigin: "USA" },
      { name: "expedition", displayName: "Expedition", countryOfOrigin: "USA" },
      { name: "excursion", displayName: "Excursion", countryOfOrigin: "USA" },
      { name: "escape", displayName: "Escape", countryOfOrigin: "USA" },
      { name: "edge", displayName: "Edge", countryOfOrigin: "USA" },
      { name: "flex", displayName: "Flex", countryOfOrigin: "USA" },
      { name: "fiesta", displayName: "Fiesta", countryOfOrigin: "USA" },
      { name: "focus", displayName: "Focus", countryOfOrigin: "USA" },
      { name: "fusion", displayName: "Fusion", countryOfOrigin: "USA" },
      { name: "taurus", displayName: "Taurus", countryOfOrigin: "USA" },
      {
        name: "crown-victoria",
        displayName: "Crown Victoria",
        countryOfOrigin: "USA",
      },
      {
        name: "grand-marquis",
        displayName: "Grand Marquis",
        countryOfOrigin: "USA",
      },
      { name: "town-car", displayName: "Town Car", countryOfOrigin: "USA" },
      {
        name: "continental-mark",
        displayName: "Continental Mark",
        countryOfOrigin: "USA",
      },
      { name: "zephyr", displayName: "Zephyr", countryOfOrigin: "USA" },
      { name: "capri", displayName: "Capri", countryOfOrigin: "USA" },
      { name: "cougar", displayName: "Cougar", countryOfOrigin: "USA" },
      { name: "marauder", displayName: "Marauder", countryOfOrigin: "USA" },
      { name: "sable", displayName: "Sable", countryOfOrigin: "USA" },
      { name: "montego", displayName: "Montego", countryOfOrigin: "USA" },
      { name: "milan", displayName: "Milan", countryOfOrigin: "USA" },
      {
        name: "mountaineer",
        displayName: "Mountaineer",
        countryOfOrigin: "USA",
      },
      { name: "villager", displayName: "Villager", countryOfOrigin: "USA" },
      { name: "quest", displayName: "Quest", countryOfOrigin: "USA" },
      { name: "windstar", displayName: "Windstar", countryOfOrigin: "USA" },
      { name: "freestar", displayName: "Freestar", countryOfOrigin: "USA" },
      { name: "aerostar", displayName: "Aerostar", countryOfOrigin: "USA" },
      { name: "econoline", displayName: "Econoline", countryOfOrigin: "USA" },
      { name: "club-wagon", displayName: "Club Wagon", countryOfOrigin: "USA" },
      { name: "transit", displayName: "Transit", countryOfOrigin: "USA" },
      { name: "e-series", displayName: "E-Series", countryOfOrigin: "USA" },
      { name: "f-series", displayName: "F-Series", countryOfOrigin: "USA" },
      { name: "super-duty", displayName: "Super Duty", countryOfOrigin: "USA" },
      { name: "heavy-duty", displayName: "Heavy Duty", countryOfOrigin: "USA" },
      {
        name: "medium-duty",
        displayName: "Medium Duty",
        countryOfOrigin: "USA",
      },
      { name: "light-duty", displayName: "Light Duty", countryOfOrigin: "USA" },
      { name: "cargo", displayName: "Cargo", countryOfOrigin: "USA" },
      { name: "cutaway", displayName: "Cutaway", countryOfOrigin: "USA" },
      {
        name: "stripped-chassis",
        displayName: "Stripped Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "incomplete-vehicle",
        displayName: "Incomplete Vehicle",
        countryOfOrigin: "USA",
      },
      {
        name: "motor-home-chassis",
        displayName: "Motor Home Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "bus-chassis",
        displayName: "Bus Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "ambulance-chassis",
        displayName: "Ambulance Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "fire-truck-chassis",
        displayName: "Fire Truck Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "tow-truck-chassis",
        displayName: "Tow Truck Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "dump-truck-chassis",
        displayName: "Dump Truck Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "concrete-mixer-chassis",
        displayName: "Concrete Mixer Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "crane-chassis",
        displayName: "Crane Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "boom-truck-chassis",
        displayName: "Boom Truck Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "bucket-truck-chassis",
        displayName: "Bucket Truck Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "platform-truck-chassis",
        displayName: "Platform Truck Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "flatbed-chassis",
        displayName: "Flatbed Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "box-truck-chassis",
        displayName: "Box Truck Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "refrigerated-truck-chassis",
        displayName: "Refrigerated Truck Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "tanker-chassis",
        displayName: "Tanker Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "livestock-chassis",
        displayName: "Livestock Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "car-carrier-chassis",
        displayName: "Car Carrier Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "lowboy-chassis",
        displayName: "Lowboy Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "step-deck-chassis",
        displayName: "Step Deck Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "extendable-chassis",
        displayName: "Extendable Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "multi-axle-chassis",
        displayName: "Multi-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "tandem-axle-chassis",
        displayName: "Tandem Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "tri-axle-chassis",
        displayName: "Tri-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "quad-axle-chassis",
        displayName: "Quad-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "5-axle-chassis",
        displayName: "5-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "6-axle-chassis",
        displayName: "6-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "7-axle-chassis",
        displayName: "7-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "8-axle-chassis",
        displayName: "8-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "9-axle-chassis",
        displayName: "9-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "10-axle-chassis",
        displayName: "10-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "11-axle-chassis",
        displayName: "11-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "12-axle-chassis",
        displayName: "12-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "13-axle-chassis",
        displayName: "13-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "14-axle-chassis",
        displayName: "14-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "15-axle-chassis",
        displayName: "15-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "16-axle-chassis",
        displayName: "16-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "17-axle-chassis",
        displayName: "17-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "18-axle-chassis",
        displayName: "18-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "19-axle-chassis",
        displayName: "19-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "20-axle-chassis",
        displayName: "20-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "21-axle-chassis",
        displayName: "21-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "22-axle-chassis",
        displayName: "22-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "23-axle-chassis",
        displayName: "23-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "24-axle-chassis",
        displayName: "24-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "25-axle-chassis",
        displayName: "25-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "26-axle-chassis",
        displayName: "26-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "27-axle-chassis",
        displayName: "27-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "28-axle-chassis",
        displayName: "28-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "29-axle-chassis",
        displayName: "29-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "30-axle-chassis",
        displayName: "30-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "31-axle-chassis",
        displayName: "31-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "32-axle-chassis",
        displayName: "32-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "33-axle-chassis",
        displayName: "33-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "34-axle-chassis",
        displayName: "34-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "35-axle-chassis",
        displayName: "35-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "36-axle-chassis",
        displayName: "36-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "37-axle-chassis",
        displayName: "37-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "38-axle-chassis",
        displayName: "38-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "39-axle-chassis",
        displayName: "39-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "40-axle-chassis",
        displayName: "40-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "41-axle-chassis",
        displayName: "41-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "42-axle-chassis",
        displayName: "42-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "43-axle-chassis",
        displayName: "43-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "44-axle-chassis",
        displayName: "44-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "45-axle-chassis",
        displayName: "45-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "46-axle-chassis",
        displayName: "46-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "47-axle-chassis",
        displayName: "47-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "48-axle-chassis",
        displayName: "48-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "49-axle-chassis",
        displayName: "49-Axle Chassis",
        countryOfOrigin: "USA",
      },
      {
        name: "50-axle-chassis",
        displayName: "50-Axle Chassis",
        countryOfOrigin: "USA",
      },
    ];

    const createdBrands = await brandRepository.save(brands);

    logger.info("Brands seeding completed successfully");
    return createdBrands;
  } catch (error) {
    logger.error("Error seeding brands", error);
    throw error;
  }
}

import { AppDataSource } from "../config/database.config";
import { User } from "../entities/User";
import { Vehicle } from "../entities/Vehicle";
import { Auction } from "../entities/Auction";
import { Bid } from "../entities/Bid";
import { Brand } from "../entities/Brand";
import { Category } from "../entities/Category";
import { UserInteraction, InteractionType } from "../entities/UserInteraction";
import * as bcrypt from "bcrypt";
import { createServiceLogger } from "../utils/logger.util";

const logger = createServiceLogger("DatabaseSeed");

// Brand data
const brands = [
  { name: "toyota", displayName: "Toyota", countryOfOrigin: "Japan" },
  { name: "honda", displayName: "Honda", countryOfOrigin: "Japan" },
  { name: "nissan", displayName: "Nissan", countryOfOrigin: "Japan" },
  { name: "mazda", displayName: "Mazda", countryOfOrigin: "Japan" },
  { name: "subaru", displayName: "Subaru", countryOfOrigin: "Japan" },
  { name: "mitsubishi", displayName: "Mitsubishi", countryOfOrigin: "Japan" },
  { name: "ford", displayName: "Ford", countryOfOrigin: "USA" },
  { name: "chevrolet", displayName: "Chevrolet", countryOfOrigin: "USA" },
  { name: "dodge", displayName: "Dodge", countryOfOrigin: "USA" },
  { name: "jeep", displayName: "Jeep", countryOfOrigin: "USA" },
  { name: "cadillac", displayName: "Cadillac", countryOfOrigin: "USA" },
  { name: "buick", displayName: "Buick", countryOfOrigin: "USA" },
  { name: "bmw", displayName: "BMW", countryOfOrigin: "Germany" },
  {
    name: "mercedes-benz",
    displayName: "Mercedes-Benz",
    countryOfOrigin: "Germany",
  },
  { name: "audi", displayName: "Audi", countryOfOrigin: "Germany" },
  { name: "volkswagen", displayName: "Volkswagen", countryOfOrigin: "Germany" },
  { name: "porsche", displayName: "Porsche", countryOfOrigin: "Germany" },
  { name: "volvo", displayName: "Volvo", countryOfOrigin: "Sweden" },
  { name: "saab", displayName: "Saab", countryOfOrigin: "Sweden" },
  { name: "fiat", displayName: "Fiat", countryOfOrigin: "Italy" },
  { name: "alfa-romeo", displayName: "Alfa Romeo", countryOfOrigin: "Italy" },
  { name: "ferrari", displayName: "Ferrari", countryOfOrigin: "Italy" },
  { name: "lamborghini", displayName: "Lamborghini", countryOfOrigin: "Italy" },
  { name: "maserati", displayName: "Maserati", countryOfOrigin: "Italy" },
  { name: "peugeot", displayName: "Peugeot", countryOfOrigin: "France" },
  { name: "renault", displayName: "Renault", countryOfOrigin: "France" },
  { name: "citroen", displayName: "Citroën", countryOfOrigin: "France" },
  { name: "hyundai", displayName: "Hyundai", countryOfOrigin: "South Korea" },
  { name: "kia", displayName: "Kia", countryOfOrigin: "South Korea" },
  {
    name: "ssangyong",
    displayName: "SsangYong",
    countryOfOrigin: "South Korea",
  },
  { name: "land-rover", displayName: "Land Rover", countryOfOrigin: "UK" },
  { name: "jaguar", displayName: "Jaguar", countryOfOrigin: "UK" },
  { name: "mini", displayName: "MINI", countryOfOrigin: "UK" },
  { name: "rolls-royce", displayName: "Rolls-Royce", countryOfOrigin: "UK" },
  { name: "bentley", displayName: "Bentley", countryOfOrigin: "UK" },
  { name: "aston-martin", displayName: "Aston Martin", countryOfOrigin: "UK" },
  { name: "mclaren", displayName: "McLaren", countryOfOrigin: "UK" },
  { name: "lotus", displayName: "Lotus", countryOfOrigin: "UK" },
  { name: "tesla", displayName: "Tesla", countryOfOrigin: "USA" },
  { name: "rivian", displayName: "Rivian", countryOfOrigin: "USA" },
  { name: "lucid", displayName: "Lucid", countryOfOrigin: "USA" },
  {
    name: "harley-davidson",
    displayName: "Harley-Davidson",
    countryOfOrigin: "USA",
  },
  { name: "polestar", displayName: "Polestar", countryOfOrigin: "Sweden" },
  { name: "nio", displayName: "NIO", countryOfOrigin: "China" },
  { name: "xpeng", displayName: "XPeng", countryOfOrigin: "China" },
  { name: "byd", displayName: "BYD", countryOfOrigin: "China" },
  { name: "geely", displayName: "Geely", countryOfOrigin: "China" },
  { name: "great-wall", displayName: "Great Wall", countryOfOrigin: "China" },
  { name: "changan", displayName: "Changan", countryOfOrigin: "China" },
  { name: "haval", displayName: "Haval", countryOfOrigin: "China" },
  { name: "mg", displayName: "MG", countryOfOrigin: "China" },
  { name: "roewe", displayName: "Roewe", countryOfOrigin: "China" },
  { name: "maxus", displayName: "Maxus", countryOfOrigin: "China" },
  { name: "wuling", displayName: "Wuling", countryOfOrigin: "China" },
  { name: "hongqi", displayName: "Hongqi", countryOfOrigin: "China" },
  { name: "lynk-co", displayName: "Lynk & Co", countryOfOrigin: "China" },
  { name: "zeekr", displayName: "Zeekr", countryOfOrigin: "China" },
  { name: "smart", displayName: "Smart", countryOfOrigin: "Germany" },
  { name: "opel", displayName: "Opel", countryOfOrigin: "Germany" },
  { name: "skoda", displayName: "Škoda", countryOfOrigin: "Czech Republic" },
  { name: "seat", displayName: "SEAT", countryOfOrigin: "Spain" },
  { name: "dacia", displayName: "Dacia", countryOfOrigin: "Romania" },
  { name: "lada", displayName: "Lada", countryOfOrigin: "Russia" },
  { name: "uaz", displayName: "UAZ", countryOfOrigin: "Russia" },
  { name: "gaz", displayName: "GAZ", countryOfOrigin: "Russia" },
  { name: "zaz", displayName: "ZAZ", countryOfOrigin: "Ukraine" },
  { name: "tata", displayName: "Tata", countryOfOrigin: "India" },
  { name: "mahindra", displayName: "Mahindra", countryOfOrigin: "India" },
  {
    name: "maruti-suzuki",
    displayName: "Maruti Suzuki",
    countryOfOrigin: "India",
  },
  { name: "hindustan", displayName: "Hindustan", countryOfOrigin: "India" },
  { name: "force", displayName: "Force", countryOfOrigin: "India" },
  {
    name: "ashok-leyland",
    displayName: "Ashok Leyland",
    countryOfOrigin: "India",
  },
  { name: "bajaj", displayName: "Bajaj", countryOfOrigin: "India" },
  { name: "hero", displayName: "Hero", countryOfOrigin: "India" },
  { name: "tvs", displayName: "TVS", countryOfOrigin: "India" },
  {
    name: "royal-enfield",
    displayName: "Royal Enfield",
    countryOfOrigin: "India",
  },
  { name: "yamaha", displayName: "Yamaha", countryOfOrigin: "Japan" },
  { name: "suzuki", displayName: "Suzuki", countryOfOrigin: "Japan" },
  { name: "kawasaki", displayName: "Kawasaki", countryOfOrigin: "Japan" },
  { name: "ducati", displayName: "Ducati", countryOfOrigin: "Italy" },
  { name: "aprilia", displayName: "Aprilia", countryOfOrigin: "Italy" },
  { name: "mv-agusta", displayName: "MV Agusta", countryOfOrigin: "Italy" },
  { name: "moto-guzzi", displayName: "Moto Guzzi", countryOfOrigin: "Italy" },
  { name: "benelli", displayName: "Benelli", countryOfOrigin: "Italy" },
  { name: "ktm", displayName: "KTM", countryOfOrigin: "Austria" },
  { name: "husqvarna", displayName: "Husqvarna", countryOfOrigin: "Sweden" },
  { name: "gas-gas", displayName: "Gas Gas", countryOfOrigin: "Spain" },
  { name: "beta", displayName: "Beta", countryOfOrigin: "Italy" },
  { name: "sherco", displayName: "Sherco", countryOfOrigin: "France" },
  { name: "tm-racing", displayName: "TM Racing", countryOfOrigin: "Italy" },
  { name: "ossa", displayName: "OSSA", countryOfOrigin: "Spain" },
  { name: "montesa", displayName: "Montesa", countryOfOrigin: "Spain" },
  { name: "bultaco", displayName: "Bultaco", countryOfOrigin: "Spain" },
  { name: "derbi", displayName: "Derbi", countryOfOrigin: "Spain" },
  { name: "rieju", displayName: "Rieju", countryOfOrigin: "Spain" },
];

// Category data
const categories = [
  // Level 0 - Main Categories
  { name: "Cars", description: "Passenger vehicles", level: 0, sortOrder: 1 },
  {
    name: "Motorcycles",
    description: "Two-wheeled vehicles",
    level: 0,
    sortOrder: 2,
  },
  {
    name: "Trucks",
    description: "Commercial vehicles",
    level: 0,
    sortOrder: 3,
  },
  {
    name: "Buses",
    description: "Public transport vehicles",
    level: 0,
    sortOrder: 4,
  },
  { name: "Trailers", description: "Towed vehicles", level: 0, sortOrder: 5 },
  { name: "Boats", description: "Watercraft", level: 0, sortOrder: 6 },
  { name: "Aircraft", description: "Flying vehicles", level: 0, sortOrder: 7 },
  {
    name: "Heavy Equipment",
    description: "Construction and industrial vehicles",
    level: 0,
    sortOrder: 8,
  },
  {
    name: "Recreational Vehicles",
    description: "RV and camping vehicles",
    level: 0,
    sortOrder: 9,
  },
  {
    name: "Classic & Vintage",
    description: "Antique and classic vehicles",
    level: 0,
    sortOrder: 10,
  },
  {
    name: "Electric Vehicles",
    description: "EV and hybrid vehicles",
    level: 0,
    sortOrder: 11,
  },
  {
    name: "Luxury Vehicles",
    description: "High-end premium vehicles",
    level: 0,
    sortOrder: 12,
  },
  {
    name: "Sports & Performance",
    description: "High-performance vehicles",
    level: 0,
    sortOrder: 13,
  },
  {
    name: "Off-Road Vehicles",
    description: "4x4 and adventure vehicles",
    level: 0,
    sortOrder: 14,
  },
  {
    name: "Commercial Vehicles",
    description: "Business and work vehicles",
    level: 0,
    sortOrder: 15,
  },
  {
    name: "Emergency Vehicles",
    description: "Police, fire, ambulance",
    level: 0,
    sortOrder: 16,
  },
  {
    name: "Military Vehicles",
    description: "Defense and security vehicles",
    level: 0,
    sortOrder: 17,
  },
  {
    name: "Agricultural Vehicles",
    description: "Farming and agricultural equipment",
    level: 0,
    sortOrder: 18,
  },
  {
    name: "Marine Vehicles",
    description: "Boats and watercraft",
    level: 0,
    sortOrder: 19,
  },
  {
    name: "Aviation Vehicles",
    description: "Aircraft and flying machines",
    level: 0,
    sortOrder: 20,
  },
  {
    name: "Space Vehicles",
    description: "Rockets and space vehicles",
    level: 0,
    sortOrder: 21,
  },
  {
    name: "Experimental Vehicles",
    description: "Prototype and concept vehicles",
    level: 0,
    sortOrder: 22,
  },
  {
    name: "Custom Vehicles",
    description: "Modified and custom vehicles",
    level: 0,
    sortOrder: 23,
  },
  {
    name: "Kit Vehicles",
    description: "DIY and kit-built vehicles",
    level: 0,
    sortOrder: 24,
  },
  {
    name: "Parts & Accessories",
    description: "Vehicle parts and accessories",
    level: 0,
    sortOrder: 25,
  },
  {
    name: "Services",
    description: "Vehicle-related services",
    level: 0,
    sortOrder: 26,
  },
];

const users = [
  {
    name: "John Smith",
    email: "john.smith@email.com",
    password: "password123",
    phone: "+1234567890",
    address: "123 Main St, New York, NY 10001",
    role: "user",
  },
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    password: "password123",
    phone: "+1234567891",
    address: "456 Oak Ave, Los Angeles, CA 90210",
    role: "user",
  },
  {
    name: "Mike Wilson",
    email: "mike.wilson@email.com",
    password: "password123",
    phone: "+1234567892",
    address: "789 Pine Rd, Chicago, IL 60601",
    role: "user",
  },
  {
    name: "Emily Davis",
    email: "emily.davis@email.com",
    password: "password123",
    phone: "+1234567893",
    address: "321 Elm St, Miami, FL 33101",
    role: "user",
  },
  {
    name: "David Brown",
    email: "david.brown@email.com",
    password: "password123",
    phone: "+1234567894",
    address: "654 Maple Dr, Seattle, WA 98101",
    role: "admin",
  },
];

const vehicles = [
  {
    title: "2019 Toyota Camry XSE",
    description:
      "Excellent condition Toyota Camry with low mileage. Well maintained with full service history.",
    brandName: "toyota", // We'll map this to brandId
    categoryName: "Cars", // We'll map this to categoryId
    model: "Camry",
    year: 2019,
    mileage: 45000,
    color: "Silver",
    condition: "Excellent",
    price: 25000,
    location: "New York, NY",
    status: "available",
    engineSize: "2.5L",
    fuelType: "Gasoline",
    transmission: "Automatic",
    bodyStyle: "Sedan",
    doors: 4,
    seats: 5,
    vin: "1HGBH41JXMN109186",
    registrationNumber: "ABC123",
    aftermarketParts: ["LED Headlights", "Custom Wheels"],
    missingParts: null,
    images: ["camry1.jpg", "camry2.jpg", "camry3.jpg"],
  },
  {
    title: "2020 Honda Civic Sport",
    description:
      "Sporty Honda Civic with great fuel efficiency. Perfect for daily commuting.",
    brandName: "honda",
    categoryName: "Sports & Performance",
    model: "Civic",
    year: 2020,
    mileage: 32000,
    color: "Blue",
    condition: "Good",
    price: 22000,
    location: "Los Angeles, CA",
    status: "available",
    engineSize: "1.5L Turbo",
    fuelType: "Gasoline",
    transmission: "CVT",
    bodyStyle: "Sedan",
    doors: 4,
    seats: 5,
    vin: "2T1BURHE0JC123456",
    registrationNumber: "XYZ789",
    aftermarketParts: ["Sport Exhaust", "Lowering Springs"],
    missingParts: null,
    images: ["civic1.jpg", "civic2.jpg"],
  },
  {
    title: "2018 BMW 3 Series",
    description:
      "Luxury BMW 3 Series with premium features. Leather interior and advanced technology.",
    brandName: "bmw",
    categoryName: "Luxury Vehicles",
    model: "3 Series",
    year: 2018,
    mileage: 55000,
    color: "Black",
    condition: "Good",
    price: 35000,
    location: "Chicago, IL",
    status: "available",
    engineSize: "2.0L Turbo",
    fuelType: "Gasoline",
    transmission: "Automatic",
    bodyStyle: "Sedan",
    doors: 4,
    seats: 5,
    vin: "3VWDX7AJ5DM123456",
    registrationNumber: "DEF456",
    aftermarketParts: ["M Sport Package", "Premium Sound System"],
    missingParts: null,
    images: ["bmw1.jpg", "bmw2.jpg", "bmw3.jpg", "bmw4.jpg"],
  },
  {
    title: "2021 Ford Mustang GT",
    description:
      "Powerful Ford Mustang GT with V8 engine. Perfect for car enthusiasts.",
    brandName: "ford",
    categoryName: "Sports & Performance",
    model: "Mustang",
    year: 2021,
    mileage: 18000,
    color: "Red",
    condition: "Excellent",
    price: 45000,
    location: "Miami, FL",
    status: "available",
    engineSize: "5.0L V8",
    fuelType: "Gasoline",
    transmission: "Manual",
    bodyStyle: "Coupe",
    doors: 2,
    seats: 4,
    vin: "4T1B11HK5JU123456",
    registrationNumber: "GHI789",
    aftermarketParts: [
      "Performance Exhaust",
      "Cold Air Intake",
      "Sport Suspension",
    ],
    missingParts: null,
    images: ["mustang1.jpg", "mustang2.jpg"],
  },
  {
    title: "2017 Audi A4",
    description:
      "Elegant Audi A4 with quattro all-wheel drive. Premium German engineering.",
    brandName: "audi",
    categoryName: "Luxury Vehicles",
    model: "A4",
    year: 2017,
    mileage: 68000,
    color: "White",
    condition: "Good",
    price: 28000,
    location: "Seattle, WA",
    status: "available",
    engineSize: "2.0L Turbo",
    fuelType: "Gasoline",
    transmission: "Automatic",
    bodyStyle: "Sedan",
    doors: 4,
    seats: 5,
    vin: "5NPE34AF5FH123456",
    registrationNumber: "JKL012",
    aftermarketParts: ["S-Line Package"],
    missingParts: null,
    images: ["audi1.jpg", "audi2.jpg", "audi3.jpg"],
  },
  {
    title: "2019 Mercedes-Benz C-Class",
    description:
      "Luxury Mercedes C-Class with advanced safety features and comfort.",
    brandName: "mercedes-benz",
    categoryName: "Luxury Vehicles",
    model: "C-Class",
    year: 2019,
    mileage: 42000,
    color: "Silver",
    condition: "Excellent",
    price: 38000,
    location: "New York, NY",
    status: "available",
    engineSize: "2.0L Turbo",
    fuelType: "Gasoline",
    transmission: "Automatic",
    bodyStyle: "Sedan",
    doors: 4,
    seats: 5,
    vin: "6G1ZT51826L123456",
    registrationNumber: "MNO345",
    aftermarketParts: ["AMG Line Package", "Panoramic Sunroof"],
    missingParts: null,
    images: ["mercedes1.jpg", "mercedes2.jpg"],
  },
  {
    title: "2020 Tesla Model 3",
    description:
      "Electric Tesla Model 3 with autopilot. Zero emissions and cutting-edge technology.",
    brandName: "tesla",
    categoryName: "Electric Vehicles",
    model: "Model 3",
    year: 2020,
    mileage: 25000,
    color: "White",
    condition: "Excellent",
    price: 42000,
    location: "San Francisco, CA",
    status: "available",
    engineSize: "Dual Motor",
    fuelType: "Electric",
    transmission: "Single Speed",
    bodyStyle: "Sedan",
    doors: 4,
    seats: 5,
    vin: "5YJ3E1EA4JF123456",
    registrationNumber: "PQR678",
    aftermarketParts: ["Premium Interior", "Autopilot"],
    missingParts: null,
    images: ["tesla1.jpg", "tesla2.jpg", "tesla3.jpg"],
  },
  {
    title: "2016 Jeep Wrangler Unlimited",
    description:
      "Rugged Jeep Wrangler Unlimited perfect for off-road adventures.",
    brandName: "jeep",
    categoryName: "Off-Road Vehicles",
    model: "Wrangler",
    year: 2016,
    mileage: 75000,
    color: "Green",
    condition: "Good",
    price: 32000,
    location: "Denver, CO",
    status: "available",
    engineSize: "3.6L V6",
    fuelType: "Gasoline",
    transmission: "Manual",
    bodyStyle: "SUV",
    doors: 4,
    seats: 5,
    vin: "1C4BJWDG8GL123456",
    registrationNumber: "STU901",
    aftermarketParts: ["Lift Kit", "Off-Road Tires", "Winch"],
    missingParts: null,
    images: ["jeep1.jpg", "jeep2.jpg"],
  },
  {
    title: "2018 Porsche 911 Carrera",
    description:
      "Iconic Porsche 911 Carrera with exceptional performance and handling.",
    brandName: "porsche",
    categoryName: "Sports & Performance",
    model: "911",
    year: 2018,
    mileage: 15000,
    color: "Black",
    condition: "Excellent",
    price: 85000,
    location: "Los Angeles, CA",
    status: "available",
    engineSize: "3.0L Turbo",
    fuelType: "Gasoline",
    transmission: "PDK",
    bodyStyle: "Coupe",
    doors: 2,
    seats: 4,
    vin: "WP0AB2A91JS123456",
    registrationNumber: "VWX234",
    aftermarketParts: ["Sport Chrono Package", "Premium Sound System"],
    missingParts: null,
    images: ["porsche1.jpg", "porsche2.jpg", "porsche3.jpg"],
  },
  {
    title: "2015 Harley-Davidson Street Glide",
    description:
      "Classic Harley-Davidson Street Glide motorcycle with custom paint.",
    brandName: "harley-davidson",
    categoryName: "Motorcycles",
    model: "Street Glide",
    year: 2015,
    mileage: 12000,
    color: "Black",
    condition: "Good",
    price: 18000,
    location: "Austin, TX",
    status: "available",
    engineSize: "103ci",
    fuelType: "Gasoline",
    transmission: "6-Speed",
    bodyStyle: "Touring",
    doors: 0,
    seats: 2,
    vin: "1HD1KPM15EB123456",
    registrationNumber: "YZ1234",
    aftermarketParts: ["Custom Exhaust", "LED Lighting"],
    missingParts: null,
    images: ["harley1.jpg", "harley2.jpg"],
  },
];

async function seedDatabase() {
  try {
    logger.info("Starting comprehensive database seeding...");

    // Initialize database connection
    await AppDataSource.initialize();

    const userRepository = AppDataSource.getRepository(User);
    const vehicleRepository = AppDataSource.getRepository(Vehicle);
    const auctionRepository = AppDataSource.getRepository(Auction);
    const bidRepository = AppDataSource.getRepository(Bid);
    const brandRepository = AppDataSource.getRepository(Brand);
    const categoryRepository = AppDataSource.getRepository(Category);
    const userInteractionRepository =
      AppDataSource.getRepository(UserInteraction);

    // Clear existing data in correct order (respecting foreign key constraints)
    logger.info("Clearing existing data...");

    // Use CASCADE to clear all related data at once
    try {
      await AppDataSource.query(
        'TRUNCATE TABLE "bid", "auction", "vehicle", "user_interaction", "user", "category", "brand" CASCADE'
      );
      logger.info("Cleared all existing data");
    } catch (error) {
      logger.warn(
        "Could not truncate with CASCADE, clearing tables individually..."
      );

      // Fallback: clear tables individually in correct order
      const bidCount = await bidRepository.count();
      if (bidCount > 0) {
        await bidRepository.clear();
        logger.info("Cleared bids");
      }

      const auctionCount = await auctionRepository.count();
      if (auctionCount > 0) {
        await auctionRepository.clear();
        logger.info("Cleared auctions");
      }

      const vehicleCount = await vehicleRepository.count();
      if (vehicleCount > 0) {
        await vehicleRepository.clear();
        logger.info("Cleared vehicles");
      }

      const userInteractionCount = await userInteractionRepository.count();
      if (userInteractionCount > 0) {
        await userInteractionRepository.clear();
        logger.info("Cleared user interactions");
      }

      const userCount = await userRepository.count();
      if (userCount > 0) {
        await userRepository.clear();
        logger.info("Cleared users");
      }

      const categoryCount = await categoryRepository.count();
      if (categoryCount > 0) {
        await categoryRepository.clear();
        logger.info("Cleared categories");
      }

      const brandCount = await brandRepository.count();
      if (brandCount > 0) {
        await brandRepository.clear();
        logger.info("Cleared brands");
      }
    }

    // Seed brands
    logger.info("Seeding brands...");
    const createdBrands = [];
    for (const brandData of brands) {
      const brand = brandRepository.create(brandData);
      const savedBrand = await brandRepository.save(brand);
      createdBrands.push(savedBrand);
      logger.info(`Created brand: ${savedBrand.displayName}`);
    }

    // Create brand lookup map
    const brandMap = new Map(createdBrands.map((brand) => [brand.name, brand]));

    // Seed categories
    logger.info("Seeding categories...");
    const createdCategories = [];
    for (const categoryData of categories) {
      const category = categoryRepository.create(categoryData);
      const savedCategory = await categoryRepository.save(category);
      createdCategories.push(savedCategory);
      logger.info(`Created category: ${savedCategory.name}`);
    }

    // Create category lookup map
    const categoryMap = new Map(
      createdCategories.map((category) => [category.name, category])
    );

    // Create users
    logger.info("Creating users...");
    const createdUsers = [];
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = userRepository.create({
        ...userData,
        password: hashedPassword,
      });
      const savedUser = await userRepository.save(user);
      createdUsers.push(savedUser);
      logger.info(`Created user: ${savedUser.name}`);
    }

    // Create vehicles with proper brand and category relationships
    logger.info("Creating vehicles...");
    const createdVehicles = [];
    for (let i = 0; i < vehicles.length; i++) {
      const vehicleData = vehicles[i];
      const brand = brandMap.get(vehicleData.brandName);
      const category = categoryMap.get(vehicleData.categoryName);

      if (!brand) {
        logger.warn(
          `Brand not found: ${vehicleData.brandName}, skipping vehicle: ${vehicleData.title}`
        );
        continue;
      }

      if (!category) {
        logger.warn(
          `Category not found: ${vehicleData.categoryName}, skipping vehicle: ${vehicleData.title}`
        );
        continue;
      }

      const vehicle = vehicleRepository.create({
        title: vehicleData.title,
        description: vehicleData.description,
        model: vehicleData.model,
        year: vehicleData.year,
        mileage: vehicleData.mileage,
        color: vehicleData.color,
        condition: vehicleData.condition,
        price: vehicleData.price,
        location: vehicleData.location,
        status: vehicleData.status,
        engineSize: vehicleData.engineSize,
        fuelType: vehicleData.fuelType,
        transmission: vehicleData.transmission,
        bodyStyle: vehicleData.bodyStyle,
        doors: vehicleData.doors,
        seats: vehicleData.seats,
        vin: vehicleData.vin,
        registrationNumber: vehicleData.registrationNumber,
        aftermarketParts: vehicleData.aftermarketParts,
        missingParts: vehicleData.missingParts,
        images: vehicleData.images,
        brand: brand,
        category: category,
        user: createdUsers[i % createdUsers.length], // Distribute vehicles among users
      });

      const savedVehicle = await vehicleRepository.save(vehicle);
      createdVehicles.push(savedVehicle);
      logger.info(
        `Created vehicle: ${savedVehicle.title} (Brand: ${brand.displayName}, Category: ${category.name})`
      );
    }

    // Create auctions
    logger.info("Creating auctions...");
    const createdAuctions = [];
    const auctionData = [
      {
        startPrice: 22000,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: "active",
      },
      {
        startPrice: 30000,
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        status: "active",
      },
      {
        startPrice: 40000,
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        status: "active",
      },
      {
        startPrice: 25000,
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        status: "active",
      },
    ];

    for (let i = 0; i < 4; i++) {
      const auction = auctionRepository.create({
        ...auctionData[i],
        vehicle: createdVehicles[i],
        user: createdVehicles[i].user,
      });
      const savedAuction = await auctionRepository.save(auction);
      createdAuctions.push(savedAuction);
      logger.info(`Created auction for: ${savedAuction.vehicle.title}`);
    }

    // Create bids
    logger.info("Creating bids...");
    const bidData = [
      { amount: 22500 },
      { amount: 23000 },
      { amount: 23500 },
      { amount: 30500 },
      { amount: 31000 },
      { amount: 40500 },
      { amount: 41000 },
      { amount: 25500 },
      { amount: 26000 },
    ];

    for (let i = 0; i < bidData.length; i++) {
      const bid = bidRepository.create({
        ...bidData[i],
        auction: createdAuctions[i % createdAuctions.length],
        user: createdUsers[i % createdUsers.length],
      });
      const savedBid = await bidRepository.save(bid);
      logger.info(
        `Created bid: $${savedBid.amount} on auction ${savedBid.auction.id}`
      );

      // Update auction's current highest bid
      const auction = await auctionRepository.findOne({
        where: { id: savedBid.auction.id },
      });
      if (
        auction &&
        (!auction.currentHighestBid ||
          savedBid.amount > auction.currentHighestBid)
      ) {
        auction.currentHighestBid = savedBid.amount;
        await auctionRepository.save(auction);
      }
    }

    // Seed UserInteractions
    logger.info("Creating user interactions...");
    const userInteractions = [];
    for (let i = 0; i < createdUsers.length; i++) {
      for (let j = 0; j < createdVehicles.length; j++) {
        // Each user views and favorites each vehicle
        userInteractions.push({
          userId: createdUsers[i].id,
          vehicleId: createdVehicles[j].id,
          interactionType: InteractionType.VIEW,
          metadata: { duration: Math.floor(Math.random() * 120) + 10 },
        });
        userInteractions.push({
          userId: createdUsers[i].id,
          vehicleId: createdVehicles[j].id,
          interactionType: InteractionType.FAVORITE,
          metadata: {},
        });
      }
      // Each user does a search
      userInteractions.push({
        userId: createdUsers[i].id,
        interactionType: InteractionType.SEARCH,
        metadata: {
          searchQuery: "sedan",
          priceRange: { min: 20000, max: 40000 },
          location: "New York, NY",
          filters: { color: "Silver" },
        },
      });
    }
    for (const interaction of userInteractions) {
      await userInteractionRepository.save(interaction);
    }
    logger.info(`Created ${userInteractions.length} user interactions`);

    logger.info("Database seeding completed successfully!");
    logger.info(`Created ${createdUsers.length} users`);
    logger.info(`Created ${createdVehicles.length} vehicles`);
    logger.info(`Created ${createdAuctions.length} auctions`);
    logger.info(`Created ${bidData.length} bids`);
    logger.info(`Created ${createdBrands.length} brands`);
    logger.info(`Created ${createdCategories.length} categories`);
  } catch (error) {
    logger.error("Error seeding database:", error);
    throw error;
  } finally {
    await AppDataSource.destroy();
  }
}

seedDatabase();

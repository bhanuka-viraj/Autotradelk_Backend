import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import { Vehicle } from "../entities/Vehicle";
import { Auction } from "../entities/Auction";
import { Bid } from "../entities/Bid";
import * as bcrypt from "bcrypt";

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
    brand: "Toyota",
    model: "Camry",
    year: 2019,
    mileage: 45000,
    color: "Silver",
    condition: "Excellent",
    price: 25000,
    location: "New York, NY",
    status: "available",
    aftermarketParts: ["LED Headlights", "Custom Wheels"],
    missingParts: null,
    images: ["camry1.jpg", "camry2.jpg", "camry3.jpg"],
  },
  {
    title: "2020 Honda Civic Sport",
    description:
      "Sporty Honda Civic with great fuel efficiency. Perfect for daily commuting.",
    brand: "Honda",
    model: "Civic",
    year: 2020,
    mileage: 32000,
    color: "Blue",
    condition: "Good",
    price: 22000,
    location: "Los Angeles, CA",
    status: "available",
    aftermarketParts: ["Sport Exhaust", "Lowering Springs"],
    missingParts: null,
    images: ["civic1.jpg", "civic2.jpg"],
  },
  {
    title: "2018 BMW 3 Series",
    description:
      "Luxury BMW 3 Series with premium features. Leather interior and advanced technology.",
    brand: "BMW",
    model: "3 Series",
    year: 2018,
    mileage: 55000,
    color: "Black",
    condition: "Good",
    price: 35000,
    location: "Chicago, IL",
    status: "available",
    aftermarketParts: ["M Sport Package", "Premium Sound System"],
    missingParts: null,
    images: ["bmw1.jpg", "bmw2.jpg", "bmw3.jpg", "bmw4.jpg"],
  },
  {
    title: "2021 Ford Mustang GT",
    description:
      "Powerful Ford Mustang GT with V8 engine. Perfect for car enthusiasts.",
    brand: "Ford",
    model: "Mustang",
    year: 2021,
    mileage: 18000,
    color: "Red",
    condition: "Excellent",
    price: 45000,
    location: "Miami, FL",
    status: "available",
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
    brand: "Audi",
    model: "A4",
    year: 2017,
    mileage: 68000,
    color: "White",
    condition: "Good",
    price: 28000,
    location: "Seattle, WA",
    status: "available",
    aftermarketParts: ["S-Line Package"],
    missingParts: null,
    images: ["audi1.jpg", "audi2.jpg", "audi3.jpg"],
  },
  {
    title: "2019 Mercedes-Benz C-Class",
    description:
      "Luxury Mercedes C-Class with advanced safety features and comfort.",
    brand: "Mercedes-Benz",
    model: "C-Class",
    year: 2019,
    mileage: 42000,
    color: "Silver",
    condition: "Excellent",
    price: 38000,
    location: "New York, NY",
    status: "available",
    aftermarketParts: ["AMG Line Package", "Panoramic Sunroof"],
    missingParts: null,
    images: ["mercedes1.jpg", "mercedes2.jpg"],
  },
];

async function seedDatabase() {
  try {
    console.log("Starting database seeding...");

    // Initialize database connection
    await AppDataSource.initialize();

    const userRepository = AppDataSource.getRepository(User);
    const vehicleRepository = AppDataSource.getRepository(Vehicle);
    const auctionRepository = AppDataSource.getRepository(Auction);
    const bidRepository = AppDataSource.getRepository(Bid);

    // Clear existing data (only if data exists)
    console.log("Clearing existing data...");

    // Check if data exists before deleting
    const bidCount = await bidRepository.count();
    if (bidCount > 0) {
      await bidRepository.clear();
      console.log("Cleared bids");
    }

    const auctionCount = await auctionRepository.count();
    if (auctionCount > 0) {
      await auctionRepository.clear();
      console.log("Cleared auctions");
    }

    const vehicleCount = await vehicleRepository.count();
    if (vehicleCount > 0) {
      await vehicleRepository.clear();
      console.log("Cleared vehicles");
    }

    const userCount = await userRepository.count();
    if (userCount > 0) {
      await userRepository.clear();
      console.log("Cleared users");
    }

    // Create users
    console.log("Creating users...");
    const createdUsers = [];
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = userRepository.create({
        ...userData,
        password: hashedPassword,
      });
      const savedUser = await userRepository.save(user);
      createdUsers.push(savedUser);
      console.log(`Created user: ${savedUser.name}`);
    }

    // Create vehicles
    console.log("Creating vehicles...");
    const createdVehicles = [];
    for (let i = 0; i < vehicles.length; i++) {
      const vehicleData = vehicles[i];
      const vehicle = vehicleRepository.create({
        ...vehicleData,
        user: createdUsers[i % createdUsers.length], // Distribute vehicles among users
      });
      const savedVehicle = await vehicleRepository.save(vehicle);
      createdVehicles.push(savedVehicle);
      console.log(`Created vehicle: ${savedVehicle.title}`);
    }

    // Create auctions
    console.log("Creating auctions...");
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
      console.log(`Created auction for: ${savedAuction.vehicle.title}`);
    }

    // Create bids
    console.log("Creating bids...");
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
      console.log(
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

    console.log("Database seeding completed successfully!");
    console.log(`Created ${createdUsers.length} users`);
    console.log(`Created ${createdVehicles.length} vehicles`);
    console.log(`Created ${createdAuctions.length} auctions`);
    console.log(`Created ${bidData.length} bids`);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

seedDatabase();

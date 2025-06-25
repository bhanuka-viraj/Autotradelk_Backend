import { AppDataSource } from "../config/database.config";
import { Auction } from "../entities/Auction";
import { Vehicle } from "../entities/Vehicle";
import { User } from "../entities/User";
import { Location } from "../entities/Location";
import { createServiceLogger } from "../utils/logger.util";

const logger = createServiceLogger("AuctionsSeed");

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

export async function seedAuctions(
  vehicles: Vehicle[],
  users: User[],
  locations: Location[]
): Promise<Auction[]> {
  try {
    logger.info("Starting auctions seeding...");

    const auctionRepository = AppDataSource.getRepository(Auction);

    // Create auctions
    const createdAuctions = [];
    for (let i = 0; i < auctionData.length; i++) {
      const data = auctionData[i];
      const vehicle = vehicles[i % vehicles.length];
      const user = users[i % users.length];

      if (!vehicle) {
        logger.warn(`Vehicle not found for auction ${i}, skipping`);
        continue;
      }

      if (!user) {
        logger.warn(`User not found for auction ${i}, skipping`);
        continue;
      }

      const auction = auctionRepository.create({
        startPrice: data.startPrice,
        currentHighestBid: null, // No bids initially
        deadline: data.deadline,
        status: data.status,
        vehicle: vehicle,
        user: user,
        location: vehicle.location, // Use vehicle's location
      });

      const savedAuction = await auctionRepository.save(auction);
      createdAuctions.push(savedAuction);
      logger.info(
        `Created auction: ${savedAuction.id} for vehicle: ${vehicle.title}`
      );
    }

    logger.info("Auctions seeding completed successfully", {
      auctionCount: createdAuctions.length,
    });

    return createdAuctions;
  } catch (error) {
    logger.error("Error seeding auctions", { error });
    throw error;
  }
}

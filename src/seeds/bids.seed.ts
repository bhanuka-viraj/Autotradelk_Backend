import { AppDataSource } from "../config/database.config";
import { Bid } from "../entities/Bid";
import { Auction } from "../entities/Auction";
import { User } from "../entities/User";
import { createServiceLogger } from "../utils/logger.util";

const logger = createServiceLogger("BidsSeed");

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

export async function seedBids(
  auctions: Auction[],
  users: User[]
): Promise<Bid[]> {
  try {
    logger.info("Starting bids seeding...");

    const bidRepository = AppDataSource.getRepository(Bid);

    // Create bids
    const createdBids = [];
    for (let i = 0; i < bidData.length; i++) {
      const data = bidData[i];
      const auction = auctions[i % auctions.length];
      const user = users[i % users.length];

      if (!auction) {
        logger.warn(`Auction not found for bid ${i}, skipping`);
        continue;
      }

      if (!user) {
        logger.warn(`User not found for bid ${i}, skipping`);
        continue;
      }

      const bid = bidRepository.create({
        amount: data.amount,
        auction: auction,
        user: user,
      });

      const savedBid = await bidRepository.save(bid);
      createdBids.push(savedBid);
      logger.info(
        `Created bid: ${savedBid.id} for auction: ${auction.id} by user: ${user.name}`
      );
    }

    logger.info("Bids seeding completed successfully", {
      bidCount: createdBids.length,
    });

    return createdBids;
  } catch (error) {
    logger.error("Error seeding bids", { error });
    throw error;
  }
}

import { AppDataSource } from "../config/database";
import { Auction } from "../entities/Auction";
import { Bid } from "../entities/Bid";
import { Vehicle } from "../entities/Vehicle";

interface FindAllQuery {
  page?: number;
  limit?: number;
}

interface FindAllResponse {
  data: Auction[];
  meta: { total: number; page: number; limit: number };
}

interface CreateBidData {
  amount: number;
  userId: number;
}

interface CreateAuctionData {
  vehicleId: number;
  startPrice: number;
  deadline: string;
  userId: number;
}

export class AuctionsService {
  async findAll({
    page = 1,
    limit = 10,
  }: FindAllQuery): Promise<FindAllResponse> {
    const auctionRepository = AppDataSource.getRepository(Auction);
    const query = auctionRepository
      .createQueryBuilder("auction")
      .leftJoinAndSelect("auction.vehicle", "vehicle")
      .where("auction.status = :status", { status: "active" })
      .skip((page - 1) * limit)
      .take(limit);

    const [auctions, total] = await query.getManyAndCount();
    return { data: auctions, meta: { total, page, limit } };
  }

  async findOne(id: number): Promise<Auction> {
    const auctionRepository = AppDataSource.getRepository(Auction);
    const auction = await auctionRepository.findOne({
      where: { id },
      relations: ["vehicle", "user", "bids", "bids.user"],
    });
    if (!auction) throw new Error("Auction not found");
    return auction;
  }

  async createBid(auctionId: number, data: CreateBidData): Promise<Bid> {
    const auctionRepository = AppDataSource.getRepository(Auction);
    const bidRepository = AppDataSource.getRepository(Bid);

    const auction = await auctionRepository.findOne({
      where: { id: auctionId },
    });
    if (!auction) throw new Error("Auction not found");
    if (auction.status !== "active") throw new Error("Auction is not active");
    if (new Date() > new Date(auction.deadline))
      throw new Error("Auction has ended");
    if (data.amount <= (auction.currentHighestBid || auction.startPrice)) {
      throw new Error(
        "Bid amount must be higher than current highest bid or start price"
      );
    }

    const bid = bidRepository.create({
      auction,
      user: { id: data.userId },
      amount: data.amount,
    });

    await bidRepository.save(bid);

    // Update auction's current highest bid
    auction.currentHighestBid = data.amount;
    await auctionRepository.save(auction);

    return bid;
  }

  async create(data: CreateAuctionData): Promise<Auction> {
    const auctionRepository = AppDataSource.getRepository(Auction);
    const vehicleRepository = AppDataSource.getRepository(Vehicle);

    const vehicle = await vehicleRepository.findOne({
      where: { id: data.vehicleId },
      relations: ["user", "auctions"],
    });
    if (!vehicle) throw new Error("Vehicle not found");
    if (vehicle.user.id !== data.userId)
      throw new Error("User does not own this vehicle");
    if (vehicle.auctions && vehicle.auctions.length > 0)
      throw new Error("Vehicle is already in an auction");

    const auction = auctionRepository.create({
      vehicle: { id: data.vehicleId },
      user: { id: data.userId },
      startPrice: data.startPrice,
      deadline: new Date(data.deadline),
      status: "active",
    });

    await auctionRepository.save(auction);
    return auction;
  }
}

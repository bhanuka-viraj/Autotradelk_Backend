import { AppDataSource } from "../config/database.config";
import { Auction } from "../entities/Auction";
import { Bid } from "../entities/Bid";
import { Vehicle } from "../entities/Vehicle";
import { createServiceLogger } from "../utils/logger.util";
import { getUserSelectFields } from "../utils/response.util";

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
  private logger = createServiceLogger("AuctionsService");

  async findAll({
    page = 1,
    limit = 10,
  }: FindAllQuery): Promise<FindAllResponse> {
    this.logger.info("Find all auctions request", { page, limit });

    const auctionRepository = AppDataSource.getRepository(Auction);
    const query = auctionRepository
      .createQueryBuilder("auction")
      .leftJoinAndSelect("auction.vehicle", "vehicle")
      .where("auction.status = :status", { status: "active" })
      .skip((page - 1) * limit)
      .take(limit);

    const [auctions, total] = await query.getManyAndCount();

    this.logger.info("Auctions retrieved successfully", {
      count: auctions.length,
      total,
      page,
      limit,
    });

    return { data: auctions, meta: { total, page, limit } };
  }

  async findOne(id: number): Promise<Auction> {
    this.logger.info("Find auction request", { auctionId: id });

    const auctionRepository = AppDataSource.getRepository(Auction);
    const auction = await auctionRepository
      .createQueryBuilder("auction")
      .leftJoinAndSelect("auction.vehicle", "vehicle")
      .leftJoinAndSelect("auction.user", "user")
      .leftJoinAndSelect("auction.bids", "bids")
      .leftJoinAndSelect("bids.user", "bidUser")
      .select([
        "auction",
        "vehicle",
        ...getUserSelectFields("user"),
        "bids",
        ...getUserSelectFields("bidUser"),
      ])
      .where("auction.id = :id", { id })
      .getOne();

    if (!auction) {
      this.logger.warn("Auction not found", { auctionId: id });
      throw new Error("Auction not found");
    }

    this.logger.info("Auction retrieved successfully", {
      auctionId: id,
      bidCount: auction.bids?.length || 0,
    });

    return auction;
  }

  async createBid(auctionId: number, data: CreateBidData): Promise<Bid> {
    this.logger.info("Create bid request", {
      auctionId,
      userId: data.userId,
      amount: data.amount,
    });

    const auctionRepository = AppDataSource.getRepository(Auction);
    const bidRepository = AppDataSource.getRepository(Bid);

    const auction = await auctionRepository.findOne({
      where: { id: auctionId },
    });

    if (!auction) {
      this.logger.warn("Auction not found for bid", { auctionId });
      throw new Error("Auction not found");
    }

    if (auction.status !== "active") {
      this.logger.warn("Bid rejected: Auction not active", {
        auctionId,
        status: auction.status,
      });
      throw new Error("Auction is not active");
    }

    if (new Date() > new Date(auction.deadline)) {
      this.logger.warn("Bid rejected: Auction ended", {
        auctionId,
        deadline: auction.deadline,
      });
      throw new Error("Auction has ended");
    }

    if (data.amount <= (auction.currentHighestBid || auction.startPrice)) {
      this.logger.warn("Bid rejected: Amount too low", {
        auctionId,
        bidAmount: data.amount,
        currentHighest: auction.currentHighestBid || auction.startPrice,
      });
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

    this.logger.info("Bid created successfully", {
      bidId: bid.id,
      auctionId,
      userId: data.userId,
      amount: data.amount,
    });

    return bid;
  }

  async create(data: CreateAuctionData): Promise<Auction> {
    this.logger.info("Create auction request", {
      vehicleId: data.vehicleId,
      userId: data.userId,
      startPrice: data.startPrice,
    });

    const auctionRepository = AppDataSource.getRepository(Auction);
    const vehicleRepository = AppDataSource.getRepository(Vehicle);

    const vehicle = await vehicleRepository
      .createQueryBuilder("vehicle")
      .leftJoinAndSelect("vehicle.user", "user")
      .leftJoinAndSelect("vehicle.auctions", "auctions")
      .select(["vehicle", "auctions", ...getUserSelectFields("user")])
      .where("vehicle.id = :vehicleId", { vehicleId: data.vehicleId })
      .getOne();

    if (!vehicle) {
      this.logger.warn("Vehicle not found for auction creation", {
        vehicleId: data.vehicleId,
      });
      throw new Error("Vehicle not found");
    }

    if (vehicle.user.id !== data.userId) {
      this.logger.warn("Auction creation rejected: User does not own vehicle", {
        vehicleId: data.vehicleId,
        userId: data.userId,
        vehicleOwnerId: vehicle.user.id,
      });
      throw new Error("User does not own this vehicle");
    }

    if (vehicle.auctions && vehicle.auctions.length > 0) {
      this.logger.warn(
        "Auction creation rejected: Vehicle already in auction",
        { vehicleId: data.vehicleId }
      );
      throw new Error("Vehicle is already in an auction");
    }

    const auction = auctionRepository.create({
      vehicle: { id: data.vehicleId },
      user: { id: data.userId },
      startPrice: data.startPrice,
      deadline: new Date(data.deadline),
      status: "active",
    });

    await auctionRepository.save(auction);

    this.logger.info("Auction created successfully", {
      auctionId: auction.id,
      vehicleId: data.vehicleId,
      userId: data.userId,
    });

    return auction;
  }

  async getAuctionBids(auctionId: number): Promise<Bid[]> {
    this.logger.info("Get auction bids request", { auctionId });

    const bidRepository = AppDataSource.getRepository(Bid);

    // First check if auction exists
    const auctionRepository = AppDataSource.getRepository(Auction);
    const auction = await auctionRepository.findOne({
      where: { id: auctionId },
    });

    if (!auction) {
      this.logger.warn("Auction not found for bids", { auctionId });
      throw new Error("Auction not found");
    }

    const bids = await bidRepository
      .createQueryBuilder("bid")
      .leftJoinAndSelect("bid.user", "user")
      .select(["bid", ...getUserSelectFields("user")])
      .where("bid.auction.id = :auctionId", { auctionId })
      .orderBy("bid.amount", "DESC")
      .getMany();

    this.logger.info("Auction bids retrieved successfully", {
      auctionId,
      bidCount: bids.length,
    });

    return bids;
  }
}

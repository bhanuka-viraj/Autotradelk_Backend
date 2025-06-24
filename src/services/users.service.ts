import { AppDataSource } from "../config/database.config";
import { User } from "../entities/User";
import { Vehicle } from "../entities/Vehicle";
import { Bid } from "../entities/Bid";
import { createServiceLogger } from "../utils/logger.util";
import { getUserSelectFields } from "../utils/response.util";

export class UsersService {
  private logger = createServiceLogger("UsersService");

  async getUser(id: number, requestingUserId: number): Promise<User> {
    this.logger.info("Get user request", { userId: id, requestingUserId });

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository
      .createQueryBuilder("user")
      .select(getUserSelectFields())
      .where("user.id = :id", { id })
      .getOne();

    if (!user) {
      this.logger.warn("User not found", { userId: id });
      throw new Error("User not found");
    }

    if (id !== requestingUserId) {
      this.logger.warn("Unauthorized access attempt", {
        userId: id,
        requestingUserId,
      });
      throw new Error("Unauthorized access");
    }

    this.logger.info("User retrieved successfully", { userId: id });
    return user;
  }

  async getUserVehicles(id: number): Promise<Vehicle[]> {
    this.logger.info("Get user vehicles request", { userId: id });

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
      relations: ["vehicles"],
    });

    if (!user) {
      this.logger.warn("User not found for vehicles", { userId: id });
      throw new Error("User not found");
    }

    this.logger.info("User vehicles retrieved successfully", {
      userId: id,
      vehicleCount: user.vehicles.length,
    });
    return user.vehicles;
  }

  async getUserBids(id: number): Promise<Bid[]> {
    this.logger.info("Get user bids request", { userId: id });

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
      relations: ["bids", "bids.auction", "bids.auction.vehicle"],
    });

    if (!user) {
      this.logger.warn("User not found for bids", { userId: id });
      throw new Error("User not found");
    }

    this.logger.info("User bids retrieved successfully", {
      userId: id,
      bidCount: user.bids.length,
    });
    return user.bids;
  }
}

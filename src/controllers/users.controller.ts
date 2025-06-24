import { Request, Response } from "express";
import { UsersService } from "../services/users.service";
import { createServiceLogger } from "../utils/logger.util";

export class UsersController {
  private usersService = new UsersService();
  private logger = createServiceLogger("UsersController");

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = Number(req.params.id);
      const requestingUserId = (req as any).user.userId;

      this.logger.info("Get user request received", {
        userId,
        requestingUserId,
      });

      const user = await this.usersService.getUser(userId, requestingUserId);

      this.logger.info("User retrieved successfully", { userId });
      res.json(user);
    } catch (error: any) {
      this.logger.error("Get user failed", {
        error: error.message,
        userId: Number(req.params.id),
      });

      res.status(error.message === "User not found" ? 404 : 500).json({
        statusCode: error.message === "User not found" ? 404 : 500,
        message: error.message,
      });
    }
  }

  async getUserVehicles(req: Request, res: Response): Promise<void> {
    try {
      const userId = Number(req.params.id);

      this.logger.info("Get user vehicles request received", { userId });

      const vehicles = await this.usersService.getUserVehicles(userId);

      this.logger.info("User vehicles retrieved successfully", {
        userId,
        vehicleCount: vehicles.length,
      });

      res.json(vehicles);
    } catch (error: any) {
      this.logger.error("Get user vehicles failed", {
        error: error.message,
        userId: Number(req.params.id),
      });

      res.status(error.message === "User not found" ? 404 : 500).json({
        statusCode: error.message === "User not found" ? 404 : 500,
        message: error.message,
      });
    }
  }

  async getUserBids(req: Request, res: Response): Promise<void> {
    try {
      const userId = Number(req.params.id);

      this.logger.info("Get user bids request received", { userId });

      const bids = await this.usersService.getUserBids(userId);

      this.logger.info("User bids retrieved successfully", {
        userId,
        bidCount: bids.length,
      });

      res.json(bids);
    } catch (error: any) {
      this.logger.error("Get user bids failed", {
        error: error.message,
        userId: Number(req.params.id),
      });

      res.status(error.message === "User not found" ? 404 : 500).json({
        statusCode: error.message === "User not found" ? 404 : 500,
        message: error.message,
      });
    }
  }
}

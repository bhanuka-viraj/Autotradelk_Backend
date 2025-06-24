import { Request, Response } from "express";
import { AuctionsService } from "../services/auctions.service";
import { createServiceLogger } from "../utils/logger.util";

export class AuctionsController {
  private auctionsService = new AuctionsService();
  private logger = createServiceLogger("AuctionsController");

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit } = req.query;

      this.logger.info("Get all auctions request received", { page, limit });

      const result = await this.auctionsService.findAll({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
      });

      this.logger.info("Get all auctions completed successfully", {
        count: result.data.length,
        total: result.meta.total,
      });

      res.json(result);
    } catch (error: any) {
      this.logger.error("Get all auctions failed", { error: error.message });
      res.status(500).json({ statusCode: 500, message: error.message });
    }
  }

  async getOne(req: Request, res: Response): Promise<void> {
    try {
      const auctionId = Number(req.params.id);

      this.logger.info("Get auction request received", { auctionId });

      const auction = await this.auctionsService.findOne(auctionId);

      this.logger.info("Get auction completed successfully", { auctionId });
      res.json(auction);
    } catch (error: any) {
      this.logger.error("Get auction failed", {
        error: error.message,
        auctionId: Number(req.params.id),
      });

      res.status(error.message === "Auction not found" ? 404 : 500).json({
        statusCode: error.message === "Auction not found" ? 404 : 500,
        message: error.message,
      });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId; // From authMiddleware

      this.logger.info("Create auction request received", {
        userId,
        vehicleId: req.body.vehicleId,
        startPrice: req.body.startPrice,
      });

      const auction = await this.auctionsService.create({
        ...req.body,
        userId,
      });

      this.logger.info("Create auction completed successfully", {
        auctionId: auction.id,
        userId,
      });

      res.status(201).json(auction);
    } catch (error: any) {
      this.logger.error("Create auction failed", {
        error: error.message,
        userId: (req as any).user.userId,
      });

      res
        .status(
          error.message.includes("Vehicle") || error.message.includes("Auction")
            ? 400
            : 500
        )
        .json({
          statusCode:
            error.message.includes("Vehicle") ||
            error.message.includes("Auction")
              ? 400
              : 500,
          message: error.message,
        });
    }
  }

  async createBid(req: Request, res: Response): Promise<void> {
    try {
      const auctionId = Number(req.params.id);
      const userId = (req as any).user.userId; // From authMiddleware
      const { amount } = req.body;

      this.logger.info("Create bid request received", {
        auctionId,
        userId,
        amount,
      });

      const bid = await this.auctionsService.createBid(auctionId, {
        amount,
        userId,
      });

      this.logger.info("Create bid completed successfully", {
        bidId: bid.id,
        auctionId,
        userId,
        amount,
      });

      res.status(201).json(bid);
    } catch (error: any) {
      this.logger.error("Create bid failed", {
        error: error.message,
        auctionId: Number(req.params.id),
        userId: (req as any).user.userId,
      });

      res
        .status(
          error.message.includes("Auction") || error.message.includes("Bid")
            ? 400
            : 500
        )
        .json({
          statusCode:
            error.message.includes("Auction") || error.message.includes("Bid")
              ? 400
              : 500,
          message: error.message,
        });
    }
  }

  async getAuctionBids(req: Request, res: Response): Promise<void> {
    try {
      const auctionId = Number(req.params.id);

      this.logger.info("Get auction bids request received", { auctionId });

      const bids = await this.auctionsService.getAuctionBids(auctionId);

      this.logger.info("Get auction bids completed successfully", {
        auctionId,
        bidCount: bids.length,
      });

      res.json(bids);
    } catch (error: any) {
      this.logger.error("Get auction bids failed", {
        error: error.message,
        auctionId: Number(req.params.id),
      });

      res.status(error.message === "Auction not found" ? 404 : 500).json({
        statusCode: error.message === "Auction not found" ? 404 : 500,
        message: error.message,
      });
    }
  }
}

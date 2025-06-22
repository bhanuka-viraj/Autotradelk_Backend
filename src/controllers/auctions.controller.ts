import { Request, Response } from "express";
import { AuctionsService } from "../services/auctions.service";

export class AuctionsController {
  private auctionsService = new AuctionsService();

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit } = req.query;
      const result = await this.auctionsService.findAll({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
      });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ statusCode: 500, message: error.message });
    }
  }

  async getOne(req: Request, res: Response): Promise<void> {
    try {
      const auction = await this.auctionsService.findOne(Number(req.params.id));
      res.json(auction);
    } catch (error: any) {
      res.status(error.message === "Auction not found" ? 404 : 500).json({
        statusCode: error.message === "Auction not found" ? 404 : 500,
        message: error.message,
      });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId; // From authMiddleware
      const auction = await this.auctionsService.create({
        ...req.body,
        userId,
      });
      res.status(201).json(auction);
    } catch (error: any) {
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
      const bid = await this.auctionsService.createBid(auctionId, {
        amount,
        userId,
      });
      res.status(201).json(bid);
    } catch (error: any) {
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
      const bids = await this.auctionsService.getAuctionBids(auctionId);
      res.json(bids);
    } catch (error: any) {
      res.status(error.message === "Auction not found" ? 404 : 500).json({
        statusCode: error.message === "Auction not found" ? 404 : 500,
        message: error.message,
      });
    }
  }
}

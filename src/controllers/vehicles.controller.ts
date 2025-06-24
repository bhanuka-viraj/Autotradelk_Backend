import { Request, Response } from "express";
import { VehiclesService } from "../services/vehicles.service";
import { UserInteractionsService } from "../services/user-interactions.service";
import { InteractionType } from "../entities/UserInteraction";
import { createServiceLogger } from "../utils/logger.util";

export class VehiclesController {
  private vehiclesService = new VehiclesService();
  private userInteractionsService = new UserInteractionsService();
  private logger = createServiceLogger("VehiclesController");

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { brand, priceMin, priceMax, location, page, limit } = req.query;

      this.logger.info("Get all vehicles request received", {
        brand,
        priceMin,
        priceMax,
        location,
        page,
        limit,
      });

      const result = await this.vehiclesService.findAll({
        brand: brand as string,
        priceMin: priceMin ? Number(priceMin) : undefined,
        priceMax: priceMax ? Number(priceMax) : undefined,
        location: location as string,
        page: Number(page) || 1,
        limit: Number(limit) || 10,
      });

      this.logger.info("Get all vehicles completed successfully", {
        count: result.data.length,
        total: result.meta.total,
      });

      res.json(result);
    } catch (error: any) {
      this.logger.error("Get all vehicles failed", { error: error.message });
      res.status(500).json({ statusCode: 500, message: error.message });
    }
  }

  async getOne(req: Request, res: Response): Promise<void> {
    try {
      const vehicleId = Number(req.params.id);
      const userId = (req as any).user?.userId;

      this.logger.info("Get vehicle request received", { vehicleId, userId });

      const vehicle = await this.vehiclesService.findOne(vehicleId);

      // Track view interaction if user is authenticated
      if (userId) {
        try {
          await this.userInteractionsService.trackInteraction({
            userId,
            vehicleId,
            interactionType: InteractionType.VIEW,
            metadata: {
              duration: 0, // Frontend can update this later
            },
          });
        } catch (error: any) {
          this.logger.warn("Failed to track view interaction", {
            error: error.message,
          });
        }
      }

      this.logger.info("Get vehicle completed successfully", { vehicleId });
      res.json(vehicle);
    } catch (error: any) {
      this.logger.error("Get vehicle failed", {
        error: error.message,
        vehicleId: Number(req.params.id),
      });

      res.status(error.message === "Vehicle not found" ? 404 : 500).json({
        statusCode: error.message === "Vehicle not found" ? 404 : 500,
        message: error.message,
      });
    }
  }

  async getSuggestions(req: Request, res: Response): Promise<void> {
    try {
      const vehicleId = Number(req.params.id);

      this.logger.info("Get vehicle suggestions request received", {
        vehicleId,
      });

      const suggestions = await this.vehiclesService.getVehicleSuggestions(
        vehicleId
      );

      this.logger.info("Get vehicle suggestions completed successfully", {
        vehicleId,
        suggestionCount: suggestions.length,
      });

      res.json(suggestions);
    } catch (error: any) {
      this.logger.error("Get vehicle suggestions failed", {
        error: error.message,
        vehicleId: Number(req.params.id),
      });

      res.status(error.message === "Vehicle not found" ? 404 : 500).json({
        statusCode: error.message === "Vehicle not found" ? 404 : 500,
        message: error.message,
      });
    }
  }

  async getUserSpecificSuggestions(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { limit } = req.query;

      this.logger.info("Get user-specific suggestions request received", {
        userId,
        limit,
      });

      const suggestions = await this.vehiclesService.getUserSpecificSuggestions(
        userId,
        undefined,
        Number(limit) || 8
      );

      this.logger.info("Get user-specific suggestions completed successfully", {
        userId,
        suggestionCount: suggestions.length,
      });

      res.json(suggestions);
    } catch (error: any) {
      this.logger.error("Get user-specific suggestions failed", {
        error: error.message,
        userId: (req as any).user.userId,
      });

      res.status(500).json({ statusCode: 500, message: error.message });
    }
  }

  async compare(req: Request, res: Response): Promise<void> {
    try {
      const ids = (req.query.ids as string).split(",").map(Number);
      const userId = (req as any).user?.userId;

      this.logger.info("Compare vehicles request received", {
        vehicleIds: ids,
        userId,
      });

      const vehicles = await this.vehiclesService.compareVehicles(ids);

      // Track compare interaction if user is authenticated
      if (userId) {
        try {
          await this.userInteractionsService.trackInteraction({
            userId,
            interactionType: InteractionType.COMPARE,
            metadata: {
              filters: { vehicleIds: ids },
            },
          });
        } catch (error: any) {
          this.logger.warn("Failed to track compare interaction", {
            error: error.message,
          });
        }
      }

      this.logger.info("Compare vehicles completed successfully", {
        vehicleCount: vehicles.length,
      });

      res.json(vehicles);
    } catch (error: any) {
      this.logger.error("Compare vehicles failed", { error: error.message });
      res.status(500).json({ statusCode: 500, message: error.message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;

      this.logger.info("Create vehicle request received", {
        userId,
        brand: req.body.brand,
        model: req.body.model,
      });

      const vehicle = await this.vehiclesService.create({
        ...req.body,
        userId,
      });

      this.logger.info("Create vehicle completed successfully", {
        vehicleId: vehicle.id,
        userId,
      });

      res.status(201).json(vehicle);
    } catch (error: any) {
      this.logger.error("Create vehicle failed", {
        error: error.message,
        userId: (req as any).user.userId,
      });

      res.status(400).json({ statusCode: 400, message: error.message });
    }
  }

  async search(req: Request, res: Response): Promise<void> {
    try {
      const {
        brand,
        model,
        priceMin,
        priceMax,
        location,
        mileageMax,
        color,
        condition,
        page,
        limit,
      } = req.query;
      const userId = (req as any).user?.userId;

      this.logger.info("Search vehicles request received", {
        brand,
        model,
        priceMin,
        priceMax,
        location,
        mileageMax,
        color,
        condition,
        page,
        limit,
        userId,
      });

      const result = await this.vehiclesService.search({
        brand: brand as string,
        model: model as string,
        priceMin: priceMin ? Number(priceMin) : undefined,
        priceMax: priceMax ? Number(priceMax) : undefined,
        location: location as string,
        mileageMax: mileageMax ? Number(mileageMax) : undefined,
        color: color as string,
        condition: condition as string,
        page: Number(page) || 1,
        limit: Number(limit) || 10,
      });

      // Track search interaction if user is authenticated
      if (userId) {
        try {
          await this.userInteractionsService.trackInteraction({
            userId,
            interactionType: InteractionType.SEARCH,
            metadata: {
              searchQuery: `${brand || ""} ${model || ""}`.trim(),
              priceRange:
                priceMin && priceMax
                  ? {
                      min: Number(priceMin),
                      max: Number(priceMax),
                    }
                  : undefined,
              location: location as string,
              filters: {
                brand,
                model,
                priceMin,
                priceMax,
                location,
                mileageMax,
                color,
                condition,
              },
            },
          });
        } catch (error: any) {
          this.logger.warn("Failed to track search interaction", {
            error: error.message,
          });
        }
      }

      this.logger.info("Search vehicles completed successfully", {
        count: result.data.length,
        total: result.meta.total,
      });

      res.json(result);
    } catch (error: any) {
      this.logger.error("Search vehicles failed", { error: error.message });
      res.status(500).json({ statusCode: 500, message: error.message });
    }
  }
}

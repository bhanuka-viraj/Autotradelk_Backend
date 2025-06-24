import { Request, Response } from "express";
import { VehiclesService } from "../services/vehicles.service";
import { UserInteractionsService } from "../services/user-interactions.service";
import { InteractionType } from "../entities/UserInteraction";
import { createServiceLogger } from "../utils/logger.util";
import {
  sendSuccess,
  sendPaginatedResponse,
  sendNotFound,
  sendValidationError,
  sendInternalError,
  HttpStatus,
  ApiError,
} from "../utils/response.util";
import { asyncHandler } from "../middleware/error.middleware";

export class VehiclesController {
  private vehiclesService = new VehiclesService();
  private userInteractionsService = new UserInteractionsService();
  private logger = createServiceLogger("VehiclesController");

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { brandId, categoryId, priceMin, priceMax, location, page, limit } =
      req.query;

    this.logger.info("Get all vehicles request received", {
      brandId,
      categoryId,
      priceMin,
      priceMax,
      location,
      page,
      limit,
    });

    const result = await this.vehiclesService.findAll({
      brandId: brandId ? Number(brandId) : undefined,
      categoryId: categoryId ? Number(categoryId) : undefined,
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

    sendPaginatedResponse(
      res,
      result.data,
      result.meta.total,
      result.meta.page,
      result.meta.limit
    );
  });

  getOne = asyncHandler(async (req: Request, res: Response): Promise<void> => {
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
    sendSuccess(res, vehicle);
  });

  getSuggestions = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
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

      sendSuccess(res, suggestions);
    }
  );

  getUserSpecificSuggestions = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
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

      sendSuccess(res, suggestions);
    }
  );

  compare = asyncHandler(async (req: Request, res: Response): Promise<void> => {
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

    sendSuccess(res, vehicles);
  });

  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user.userId;

    this.logger.info("Create vehicle request received", {
      userId,
      brandId: req.body.brandId,
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

    sendSuccess(
      res,
      vehicle,
      "Vehicle created successfully",
      HttpStatus.CREATED
    );
  });

  search = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const {
      brandId,
      categoryId,
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
      brandId,
      categoryId,
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
      brandId: brandId ? Number(brandId) : undefined,
      categoryId: categoryId ? Number(categoryId) : undefined,
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
            searchQuery: `${brandId || ""} ${model || ""}`.trim(),
            priceRange:
              priceMin && priceMax
                ? {
                    min: Number(priceMin),
                    max: Number(priceMax),
                  }
                : undefined,
            location: location as string,
            filters: {
              brandId,
              categoryId,
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

    sendPaginatedResponse(
      res,
      result.data,
      result.meta.total,
      result.meta.page,
      result.meta.limit
    );
  });
}

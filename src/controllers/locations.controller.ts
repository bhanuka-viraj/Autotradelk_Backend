import { Request, Response } from "express";
import { LocationsService } from "../services/locations.service";
import { createServiceLogger } from "../utils/logger.util";
import { sendSuccess, sendError, ErrorCode } from "../utils/response.util";

export class LocationsController {
  private logger = createServiceLogger("LocationsController");
  private locationsService = new LocationsService();

  async getSuggestions(req: Request, res: Response): Promise<void> {
    try {
      const { q, limit = 10 } = req.query;

      if (!q || typeof q !== "string") {
        sendError(
          res,
          ErrorCode.VALIDATION_ERROR,
          "Query parameter 'q' is required",
          400
        );
        return;
      }

      if (q.length < 2) {
        sendError(
          res,
          ErrorCode.VALIDATION_ERROR,
          "Query must be at least 2 characters long",
          400
        );
        return;
      }

      this.logger.info("Get location suggestions request", { query: q, limit });

      const suggestions = await this.locationsService.getSuggestions(
        q,
        Number(limit)
      );

      sendSuccess(
        res,
        suggestions,
        "Location suggestions retrieved successfully"
      );
    } catch (error) {
      this.logger.error("Error getting location suggestions", { error });
      sendError(
        res,
        ErrorCode.INTERNAL_ERROR,
        "Failed to get location suggestions",
        500
      );
    }
  }

  async getHierarchy(req: Request, res: Response): Promise<void> {
    try {
      this.logger.info("Get location hierarchy request");

      const hierarchy = await this.locationsService.getHierarchy();

      sendSuccess(res, hierarchy, "Location hierarchy retrieved successfully");
    } catch (error) {
      this.logger.error("Error getting location hierarchy", { error });
      sendError(
        res,
        ErrorCode.INTERNAL_ERROR,
        "Failed to get location hierarchy",
        500
      );
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const locationId = Number(id);

      if (isNaN(locationId)) {
        sendError(res, ErrorCode.VALIDATION_ERROR, "Invalid location ID", 400);
        return;
      }

      this.logger.info("Get location by ID request", { locationId });

      const location = await this.locationsService.findById(locationId);

      sendSuccess(res, location, "Location retrieved successfully");
    } catch (error) {
      this.logger.error("Error getting location by ID", { error });
      sendError(res, ErrorCode.INTERNAL_ERROR, "Failed to get location", 500);
    }
  }

  async getByType(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;
      const { parentId } = req.query;

      this.logger.info("Get locations by type request", { type, parentId });

      const locations = await this.locationsService.findByType(
        type as any,
        parentId ? Number(parentId) : undefined
      );

      sendSuccess(res, locations, "Locations retrieved successfully");
    } catch (error) {
      this.logger.error("Error getting locations by type", { error });
      sendError(res, ErrorCode.INTERNAL_ERROR, "Failed to get locations", 500);
    }
  }

  async getPopularLocations(req: Request, res: Response): Promise<void> {
    try {
      const { limit = 10 } = req.query;

      this.logger.info("Get popular locations request", { limit });

      const locations = await this.locationsService.getPopularLocations(
        Number(limit)
      );

      sendSuccess(res, locations, "Popular locations retrieved successfully");
    } catch (error) {
      this.logger.error("Error getting popular locations", { error });
      sendError(
        res,
        ErrorCode.INTERNAL_ERROR,
        "Failed to get popular locations",
        500
      );
    }
  }

  async searchLocations(req: Request, res: Response): Promise<void> {
    try {
      const { q, type, parentId, limit = 20 } = req.query;

      this.logger.info("Search locations request", {
        q,
        type,
        parentId,
        limit,
      });

      const locations = await this.locationsService.searchLocations({
        query: q as string,
        type: type as any,
        parentId: parentId ? Number(parentId) : undefined,
        limit: Number(limit),
      });

      sendSuccess(res, locations, "Location search completed successfully");
    } catch (error) {
      this.logger.error("Error searching locations", { error });
      sendError(
        res,
        ErrorCode.INTERNAL_ERROR,
        "Failed to search locations",
        500
      );
    }
  }

  async validateLocation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const locationId = Number(id);

      if (isNaN(locationId)) {
        sendError(res, ErrorCode.VALIDATION_ERROR, "Invalid location ID", 400);
        return;
      }

      this.logger.info("Validate location request", { locationId });

      const isValid = await this.locationsService.validateLocation(locationId);

      sendSuccess(
        res,
        { isValid, locationId },
        "Location validation completed"
      );
    } catch (error) {
      this.logger.error("Error validating location", { error });
      sendError(
        res,
        ErrorCode.INTERNAL_ERROR,
        "Failed to validate location",
        500
      );
    }
  }

  async getAreasByParent(req: Request, res: Response): Promise<void> {
    try {
      const { parentId } = req.params;
      const parentLocationId = Number(parentId);

      if (isNaN(parentLocationId)) {
        sendError(
          res,
          ErrorCode.VALIDATION_ERROR,
          "Invalid parent location ID",
          400
        );
        return;
      }

      this.logger.info("Get areas by parent request", { parentLocationId });

      const areas = await this.locationsService.getAreasByParent(
        parentLocationId
      );

      sendSuccess(res, areas, "Areas retrieved successfully");
    } catch (error) {
      this.logger.error("Error getting areas by parent", { error });
      sendError(res, ErrorCode.INTERNAL_ERROR, "Failed to get areas", 500);
    }
  }
}

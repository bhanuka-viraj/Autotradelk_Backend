import { Router } from "express";
import { LocationsController } from "../controllers/locations.controller";

const router = Router();
const locationsController = new LocationsController();

// Get location suggestions for autocomplete
router.get(
  "/suggestions",
  locationsController.getSuggestions.bind(locationsController)
);

// Get location hierarchy (provinces -> districts -> cities -> areas)
router.get(
  "/hierarchy",
  locationsController.getHierarchy.bind(locationsController)
);

// Get popular locations (most active)
router.get(
  "/popular",
  locationsController.getPopularLocations.bind(locationsController)
);

// Search locations with filters
router.get(
  "/search",
  locationsController.searchLocations.bind(locationsController)
);

// Get locations by type (province, district, city, area)
router.get(
  "/type/:type",
  locationsController.getByType.bind(locationsController)
);

// Get areas by parent location (province, district, or city)
router.get(
  "/:parentId/areas",
  locationsController.getAreasByParent.bind(locationsController)
);

// Get specific location by ID
router.get("/:id", locationsController.getById.bind(locationsController));

// Validate location ID
router.get(
  "/:id/validate",
  locationsController.validateLocation.bind(locationsController)
);

export default router;

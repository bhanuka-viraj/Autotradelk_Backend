import { Router } from "express";
import { VehiclesController } from "../controllers/vehicles.controller";
import { authMiddleware } from "../middleware/auth.middleWare";

const router = Router();
const vehiclesController = new VehiclesController();

router.get("/", vehiclesController.getAll.bind(vehiclesController));
router.get("/search", vehiclesController.search.bind(vehiclesController));
router.get("/:id", vehiclesController.getOne.bind(vehiclesController));
router.get(
  "/:id/suggestions",
  vehiclesController.getSuggestions.bind(vehiclesController)
);
router.get("/compare", vehiclesController.compare.bind(vehiclesController));
router.post("/", vehiclesController.create.bind(vehiclesController));

export default router;

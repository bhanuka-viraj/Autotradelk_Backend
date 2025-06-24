import { Router } from "express";
import { BrandsController } from "../controllers/brands.controller";

const router = Router();
const brandsController = new BrandsController();

// Public routes - no authentication required
router.get("/", brandsController.getAll.bind(brandsController));
router.get("/popular", brandsController.getPopular.bind(brandsController));
router.get("/:id", brandsController.getById.bind(brandsController));

// Admin routes - authentication required
router.post("/", brandsController.create.bind(brandsController));
router.put("/:id", brandsController.update.bind(brandsController));
router.delete("/:id", brandsController.delete.bind(brandsController));

export default router;

import { Router } from "express";
import { CategoriesController } from "../controllers/categories.controller";

const router = Router();
const categoriesController = new CategoriesController();

// Public routes - no authentication required
router.get("/", categoriesController.getAll.bind(categoriesController));
router.get(
  "/tree",
  categoriesController.getCategoryTree.bind(categoriesController)
);
router.get(
  "/root",
  categoriesController.getRootCategories.bind(categoriesController)
);
router.get(
  "/level/:level",
  categoriesController.getByLevel.bind(categoriesController)
);
router.get(
  "/popular",
  categoriesController.getPopular.bind(categoriesController)
);
router.get("/:id", categoriesController.getById.bind(categoriesController));

// Admin routes - authentication required
router.post("/", categoriesController.create.bind(categoriesController));
router.put("/:id", categoriesController.update.bind(categoriesController));
router.delete("/:id", categoriesController.delete.bind(categoriesController));

export default router;

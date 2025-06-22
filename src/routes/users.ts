import { Router } from "express";
import { UsersController } from "../controllers/usersController";
import { authMiddleware } from "../middleware/authMiddleWare";

const router = Router();
const usersController = new UsersController();

router.get("/:id", usersController.getUser.bind(usersController));
router.get(
  "/:id/vehicles",
  usersController.getUserVehicles.bind(usersController)
);
router.get("/:id/bids", usersController.getUserBids.bind(usersController));

export default router;

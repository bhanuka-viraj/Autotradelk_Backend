import { Router } from "express";
import { UsersController } from "../controllers/users.controller";
import {
  authMiddleware,
  ownDataMiddleware,
} from "../middleware/auth.middleware";

const router = Router();
const usersController = new UsersController();

router.get(
  "/:id",
  authMiddleware,
  ownDataMiddleware,
  usersController.getUser.bind(usersController)
);
router.get(
  "/:id/vehicles",
  authMiddleware,
  ownDataMiddleware,
  usersController.getUserVehicles.bind(usersController)
);
router.get(
  "/:id/bids",
  authMiddleware,
  ownDataMiddleware,
  usersController.getUserBids.bind(usersController)
);

export default router;

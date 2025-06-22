import { Router } from "express";
import { AuctionsController } from "../controllers/auctionsController";
import { authMiddleware } from "../middleware/authMiddleWare";

const router = Router();
const auctionsController = new AuctionsController();

router.get("/", auctionsController.getAll.bind(auctionsController));
router.get("/:id", auctionsController.getOne.bind(auctionsController));
router.get(
  "/:id/bids",
  auctionsController.getAuctionBids.bind(auctionsController)
);
router.post("/", auctionsController.create.bind(auctionsController));
router.post("/:id/bids", auctionsController.createBid.bind(auctionsController));

export default router;

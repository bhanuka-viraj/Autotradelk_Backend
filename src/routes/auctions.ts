import { Router } from 'express';
import { AuctionsController } from '../controllers/auctionsController';
import { authMiddleware } from '../middleware/authMiddleWare';

const router = Router();
const auctionsController = new AuctionsController();

router.get('/', auctionsController.getAll.bind(auctionsController));
router.get('/:id', authMiddleware, auctionsController.getOne.bind(auctionsController));
router.post('/', authMiddleware, auctionsController.create.bind(auctionsController));
router.post('/:id/bids', authMiddleware, auctionsController.createBid.bind(auctionsController));

export default router;
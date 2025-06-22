import { Request, Response } from 'express';
import { UsersService } from '../services/users.service';

export class UsersController {
  private usersService = new UsersService();

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.usersService.getUser(Number(req.params.id), (req as any).user.userId);
      res.json(user);
    } catch (error: any) {
      res.status(error.message === 'User not found' ? 404 : 500).json({
        statusCode: error.message === 'User not found' ? 404 : 500,
        message: error.message,
      });
    }
  }

  async getUserVehicles(req: Request, res: Response): Promise<void> {
    try {
      const vehicles = await this.usersService.getUserVehicles(Number(req.params.id));
      res.json(vehicles);
    } catch (error: any) {
      res.status(error.message === 'User not found' ? 404 : 500).json({
        statusCode: error.message === 'User not found' ? 404 : 500,
        message: error.message,
      });
    }
  }

  async getUserBids(req: Request, res: Response): Promise<void> {
    try {
      const bids = await this.usersService.getUserBids(Number(req.params.id));
      res.json(bids);
    } catch (error: any) {
      res.status(error.message === 'User not found' ? 404 : 500).json({
        statusCode: error.message === 'User not found' ? 404 : 500,
        message: error.message,
      });
    }
  }
}
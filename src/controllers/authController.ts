import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

export class AuthController {
  private authService = new AuthService();

  async signup(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.authService.signup(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(error.message === 'Email already exists' ? 400 : 500).json({
        statusCode: error.message === 'Email already exists' ? 400 : 500,
        message: error.message,
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.authService.login(req.body);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ statusCode: 401, message: error.message });
    }
  }
}
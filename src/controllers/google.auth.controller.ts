import { Request, Response } from "express";
import { GoogleAuthService } from "../services/google.auth.service";

export class GoogleAuthController {
  private googleAuthService = new GoogleAuthService();

  async googleLogin(req: Request, res: Response): Promise<void> {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        res.status(400).json({
          statusCode: 400,
          message: "Google ID token is required",
        });
        return;
      }

      const result = await this.googleAuthService.authenticateWithGoogle(
        idToken
      );

      res.json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      res.status(401).json({
        statusCode: 401,
        message: error.message,
      });
    }
  }
}

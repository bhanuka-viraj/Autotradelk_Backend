import { Request, Response } from "express";
import { GoogleAuthService } from "../services/google.auth.service";
import { createServiceLogger } from "../utils/logger.util";

export class GoogleAuthController {
  private googleAuthService = new GoogleAuthService();
  private logger = createServiceLogger("GoogleAuthController");

  async googleLogin(req: Request, res: Response): Promise<void> {
    try {
      this.logger.info("Google login request received");
      this.logger.debug("Request body:", req.body);
      this.logger.debug("Request headers:", req.headers);

      const { idToken, authorizationCode } = req.body;

      if (!idToken && !authorizationCode) {
        this.logger.warn(
          "No idToken or authorizationCode found in request body"
        );
        res.status(400).json({
          statusCode: 400,
          message:
            "Google ID token or authorization code is required in request body",
        });
        return;
      }

      const tokenOrCode = idToken || authorizationCode;
      this.logger.debug(`Token/Code received, length: ${tokenOrCode.length}`);

      const result = await this.googleAuthService.authenticateWithGoogle(
        tokenOrCode
      );

      this.logger.info("Google login successful");
      res.json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      this.logger.error("Google login error:", error);
      res.status(401).json({
        statusCode: 401,
        message: error.message,
      });
    }
  }
}

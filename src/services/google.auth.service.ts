import { OAuth2Client } from "google-auth-library";
import { AppDataSource } from "../config/database.config";
import { User } from "../entities/User";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { createServiceLogger } from "../utils/logger.util";

interface GoogleUserInfo {
  sub: string; // Google user ID
  email: string;
  name: string;
  picture?: string;
  email_verified: boolean;
}

interface AuthResponse {
  accessToken: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export class GoogleAuthService {
  private googleClient: OAuth2Client;
  private logger = createServiceLogger("GoogleAuthService");

  constructor() {
    this.logger.info("GoogleAuthService constructor - Environment variables:");
    this.logger.info(
      `GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID ? "SET" : "NOT SET"}`
    );
    this.logger.info(
      `GOOGLE_CLIENT_SECRET: ${
        process.env.GOOGLE_CLIENT_SECRET ? "SET" : "NOT SET"
      }`
    );
    this.logger.info(
      `JWT_SECRET: ${process.env.JWT_SECRET ? "SET" : "NOT SET"}`
    );

    this.googleClient = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
  }

  async verifyGoogleToken(idToken: string): Promise<GoogleUserInfo> {
    try {
      this.logger.debug("Verifying Google token...");
      this.logger.debug(`Token length: ${idToken.length}`);
      this.logger.debug(`Token preview: ${idToken.substring(0, 50)}...`);

      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error("Invalid Google token payload");
      }

      this.logger.info(
        `Google token verified successfully for user: ${payload.email}`
      );

      return {
        sub: payload.sub,
        email: payload.email!,
        name: payload.name!,
        picture: payload.picture,
        email_verified: payload.email_verified!,
      };
    } catch (error) {
      this.logger.error("Google token verification failed:", error);
      throw new Error("Invalid Google token");
    }
  }

  async exchangeCodeForTokens(
    authorizationCode: string
  ): Promise<{ idToken: string; accessToken: string }> {
    try {
      this.logger.info("Exchanging authorization code for tokens...");

      const { tokens } = await this.googleClient.getToken(authorizationCode);

      if (!tokens.id_token) {
        throw new Error("No ID token received from Google");
      }

      this.logger.info("Successfully exchanged code for tokens");
      return {
        idToken: tokens.id_token,
        accessToken: tokens.access_token || "",
      };
    } catch (error) {
      this.logger.error("Failed to exchange code for tokens:", error);
      throw new Error("Failed to exchange authorization code for tokens");
    }
  }

  async authenticateWithGoogle(tokenOrCode: string): Promise<AuthResponse> {
    try {
      let idToken: string;

      // Check if it's an authorization code (starts with 4/)
      if (tokenOrCode.startsWith("4/")) {
        this.logger.info(
          "Detected authorization code, exchanging for tokens..."
        );
        const tokens = await this.exchangeCodeForTokens(tokenOrCode);
        idToken = tokens.idToken;
      } else {
        this.logger.info("Using provided ID token directly...");
        idToken = tokenOrCode;
      }

      // Verify the Google ID token
      const googleUser = await this.verifyGoogleToken(idToken);

      if (!googleUser.email_verified) {
        throw new Error("Google email not verified");
      }

      const userRepository = AppDataSource.getRepository(User);

      let user = await userRepository.findOne({
        where: { email: googleUser.email },
      });

      if (!user) {
        user = userRepository.create({
          name: googleUser.name,
          email: googleUser.email,
          password: await bcrypt.hash(this.generateRandomPassword(), 10), // Generate random password for Google users
          role: "user",
          // You can add more fields like profile picture if needed
        });

        await userRepository.save(user);
        this.logger.info(`Created new user via Google: ${user.email}`);
      }

      // Generate JWT token
      const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      return {
        accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      throw new Error(
        `Google authentication failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private generateRandomPassword(): string {
    return Math.random().toString(36).slice(-10) + Date.now().toString(36);
  }
}

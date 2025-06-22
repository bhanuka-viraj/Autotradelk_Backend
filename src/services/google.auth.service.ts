import { OAuth2Client } from "google-auth-library";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

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

  constructor() {
    this.googleClient = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
  }

  async verifyGoogleToken(idToken: string): Promise<GoogleUserInfo> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error("Invalid Google token payload");
      }

      return {
        sub: payload.sub,
        email: payload.email!,
        name: payload.name!,
        picture: payload.picture,
        email_verified: payload.email_verified!,
      };
    } catch (error) {
      throw new Error("Invalid Google token");
    }
  }

  async authenticateWithGoogle(idToken: string): Promise<AuthResponse> {
    try {
      // Verify the Google ID token
      const googleUser = await this.verifyGoogleToken(idToken);

      if (!googleUser.email_verified) {
        throw new Error("Google email not verified");
      }

      const userRepository = AppDataSource.getRepository(User);

      // Check if user already exists
      let user = await userRepository.findOne({
        where: { email: googleUser.email },
      });

      if (!user) {
        // Create new user
        user = userRepository.create({
          name: googleUser.name,
          email: googleUser.email,
          password: await bcrypt.hash(this.generateRandomPassword(), 10), // Generate random password for Google users
          role: "user",
          // You can add more fields like profile picture if needed
        });

        await userRepository.save(user);
        console.log(`Created new user via Google: ${user.email}`);
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

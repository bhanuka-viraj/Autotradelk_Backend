import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: { userId: number; role: string };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ statusCode: 401, message: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
      role: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ statusCode: 401, message: "Invalid or expired token" });
  }
};

// Middleware to ensure users can only access their own data
export const ownDataMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const userId = parseInt(req.params.id);

  if (!req.user) {
    res
      .status(401)
      .json({ statusCode: 401, message: "Authentication required" });
    return;
  }

  if (req.user.userId !== userId) {
    res
      .status(403)
      .json({
        statusCode: 403,
        message: "Access denied. You can only access your own data.",
      });
    return;
  }

  next();
};

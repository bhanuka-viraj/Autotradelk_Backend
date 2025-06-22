import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: { userId: number; role: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1]; 
  if (!token) {
    res.status(401).json({ statusCode: 401, message: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number; role: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ statusCode: 401, message: 'Invalid or expired token' });
  }
};
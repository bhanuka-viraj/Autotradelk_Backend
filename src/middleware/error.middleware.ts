import { Request, Response, NextFunction } from "express";
import {
  ApiError,
  sendInternalError,
  ErrorCode,
  HttpStatus,
} from "../utils/response.util";
import { createServiceLogger } from "../utils/logger.util";

const logger = createServiceLogger("ErrorMiddleware");

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error("Unhandled error occurred", {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    userId: (req as any).user?.userId,
  });

  // Handle ApiError instances
  if (error instanceof ApiError) {
    const { statusCode, errorCode, message, details } = error;

    res.status(statusCode).json({
      success: false,
      error: {
        code: errorCode,
        message,
        details,
        timestamp: new Date().toISOString(),
      },
    });
    return;
  }

  // Handle TypeORM errors
  if (error.name === "QueryFailedError") {
    logger.error("Database query failed", { error: error.message });

    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      error: {
        code: ErrorCode.DATABASE_ERROR,
        message: "Database operation failed",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
        timestamp: new Date().toISOString(),
      },
    });
    return;
  }

  // Handle validation errors
  if (error.name === "ValidationError") {
    logger.error("Validation error", { error: error.message });

    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message: "Validation failed",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
        timestamp: new Date().toISOString(),
      },
    });
    return;
  }

  // Handle JWT errors
  if (error.name === "JsonWebTokenError") {
    logger.error("JWT error", { error: error.message });

    res.status(HttpStatus.UNAUTHORIZED).json({
      success: false,
      error: {
        code: ErrorCode.INVALID_TOKEN,
        message: "Invalid token",
        timestamp: new Date().toISOString(),
      },
    });
    return;
  }

  if (error.name === "TokenExpiredError") {
    logger.error("Token expired", { error: error.message });

    res.status(HttpStatus.UNAUTHORIZED).json({
      success: false,
      error: {
        code: ErrorCode.TOKEN_EXPIRED,
        message: "Token expired",
        timestamp: new Date().toISOString(),
      },
    });
    return;
  }

  // Handle unknown errors
  sendInternalError(
    res,
    process.env.NODE_ENV === "development"
      ? error.message
      : "Internal server error"
  );
};

// Async error wrapper for controllers
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler for unmatched routes
export const notFoundHandler = (req: Request, res: Response): void => {
  logger.warn("Route not found", {
    url: req.url,
    method: req.method,
  });

  res.status(HttpStatus.NOT_FOUND).json({
    success: false,
    error: {
      code: ErrorCode.NOT_FOUND,
      message: "Route not found",
      timestamp: new Date().toISOString(),
    },
  });
};

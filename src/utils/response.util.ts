import { Response } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
  };
}

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

export enum ErrorCode {
  // Authentication & Authorization
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  INVALID_TOKEN = "INVALID_TOKEN",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",

  // Resource Errors
  NOT_FOUND = "NOT_FOUND",
  ALREADY_EXISTS = "ALREADY_EXISTS",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_INPUT = "INVALID_INPUT",

  // Business Logic Errors
  INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS",
  AUCTION_ENDED = "AUCTION_ENDED",
  BID_TOO_LOW = "BID_TOO_LOW",
  VEHICLE_NOT_AVAILABLE = "VEHICLE_NOT_AVAILABLE",

  // System Errors
  INTERNAL_ERROR = "INTERNAL_ERROR",
  DATABASE_ERROR = "DATABASE_ERROR",
  EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR",
}

// Success Response Helper
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  status: number = HttpStatus.OK,
  meta?: any
): void => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    meta,
  };

  res.status(status).json(response);
};

// Error Response Helper
export const sendError = (
  res: Response,
  errorCode: ErrorCode,
  message: string,
  status: number = HttpStatus.INTERNAL_SERVER_ERROR,
  details?: any
): void => {
  const errorResponse: ApiErrorResponse = {
    success: false,
    error: {
      code: errorCode,
      message,
      details,
      timestamp: new Date().toISOString(),
    },
  };

  res.status(status).json(errorResponse);
};

// Common Error Responses
export const sendNotFound = (res: Response, resource: string): void => {
  sendError(
    res,
    ErrorCode.NOT_FOUND,
    `${resource} not found`,
    HttpStatus.NOT_FOUND
  );
};

export const sendUnauthorized = (
  res: Response,
  message: string = "Unauthorized"
): void => {
  sendError(res, ErrorCode.UNAUTHORIZED, message, HttpStatus.UNAUTHORIZED);
};

export const sendForbidden = (
  res: Response,
  message: string = "Access denied"
): void => {
  sendError(res, ErrorCode.FORBIDDEN, message, HttpStatus.FORBIDDEN);
};

export const sendValidationError = (
  res: Response,
  message: string,
  details?: any
): void => {
  sendError(
    res,
    ErrorCode.VALIDATION_ERROR,
    message,
    HttpStatus.BAD_REQUEST,
    details
  );
};

export const sendConflict = (res: Response, message: string): void => {
  sendError(res, ErrorCode.ALREADY_EXISTS, message, HttpStatus.CONFLICT);
};

export const sendInternalError = (
  res: Response,
  message: string = "Internal server error"
): void => {
  sendError(
    res,
    ErrorCode.INTERNAL_ERROR,
    message,
    HttpStatus.INTERNAL_SERVER_ERROR
  );
};

// Pagination Response Helper
export const sendPaginatedResponse = <T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number
): void => {
  const totalPages = Math.ceil(total / limit);

  const meta = {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };

  sendSuccess(res, data, undefined, HttpStatus.OK, meta);
};

// Custom Error Class for Services
export class ApiError extends Error {
  public statusCode: number;
  public errorCode: ErrorCode;
  public details?: any;

  constructor(
    message: string,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: ErrorCode = ErrorCode.INTERNAL_ERROR,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.name = "ApiError";
  }

  static notFound(resource: string): ApiError {
    return new ApiError(
      `${resource} not found`,
      HttpStatus.NOT_FOUND,
      ErrorCode.NOT_FOUND
    );
  }

  static unauthorized(message: string = "Unauthorized"): ApiError {
    return new ApiError(
      message,
      HttpStatus.UNAUTHORIZED,
      ErrorCode.UNAUTHORIZED
    );
  }

  static forbidden(message: string = "Access denied"): ApiError {
    return new ApiError(message, HttpStatus.FORBIDDEN, ErrorCode.FORBIDDEN);
  }

  static validationError(message: string, details?: any): ApiError {
    return new ApiError(
      message,
      HttpStatus.BAD_REQUEST,
      ErrorCode.VALIDATION_ERROR,
      details
    );
  }

  static conflict(message: string): ApiError {
    return new ApiError(message, HttpStatus.CONFLICT, ErrorCode.ALREADY_EXISTS);
  }
}

export const USER_SELECT_FIELDS = [
  "user.id",
  "user.name",
  "user.email",
  "user.phone",
  "user.address",
  "user.role",
  "user.googleId",
  "user.createdAt",
  "user.updatedAt",
] as const;

/**
 * Creates a select array for user data without password
 * @param alias - The alias used for the user table (default: "user")
 * @returns Array of select fields for user without password
 */
export function getUserSelectFields(alias: string = "user"): string[] {
  return USER_SELECT_FIELDS.map((field) => field.replace("user.", `${alias}.`));
}

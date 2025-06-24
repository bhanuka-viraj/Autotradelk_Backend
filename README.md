# AutoTradeLK Backend

A Node.js/TypeScript backend for an auto trading platform with PostgreSQL database.

## Features

- **User Authentication**: JWT-based authentication with Google OAuth support
- **Vehicle Management**: CRUD operations for vehicles with search and comparison
- **Auction System**: Create and manage auctions with bidding functionality
- **Comprehensive Logging**: Winston-based logging with service-specific loggers
- **Database Management**: PostgreSQL with TypeORM for data persistence
- **Security**: Protected routes with authentication and authorization middleware

## Route Protection & Security

### 🔒 **Protected Routes**

#### **Authentication Required**

- `POST /api/vehicles` - Create vehicle (user must be logged in)
- `POST /api/auctions` - Create auction (user must own the vehicle)
- `POST /api/auctions/:id/bids` - Place bid (user must be logged in)
- `GET /api/users/:id` - View own profile (user can only access their own data)
- `GET /api/users/:id/vehicles` - View own vehicles (user can only access their own data)
- `GET /api/users/:id/bids` - View own bids (user can only access their own data)

#### **Public Routes**

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login
- `GET /api/vehicles` - Browse all vehicles
- `GET /api/vehicles/search` - Search vehicles
- `GET /api/vehicles/:id` - View vehicle details
- `GET /api/vehicles/:id/suggestions` - Get vehicle suggestions
- `GET /api/vehicles/compare` - Compare vehicles
- `GET /api/auctions` - Browse all auctions
- `GET /api/auctions/:id` - View auction details
- `GET /api/auctions/:id/bids` - View auction bids

### **Security Features**

1. **JWT Authentication**: All protected routes require a valid JWT token
2. **Own Data Protection**: Users can only access their own profile, vehicles, and bids
3. **Vehicle Ownership Validation**: Only vehicle owners can create auctions for their vehicles
4. **Bid Validation**: Bids are validated for auction status, deadline, and amount
5. **Input Validation**: All user inputs are validated and sanitized

### **Authentication Flow**

1. **Registration/Login**: Users register or login to get a JWT token
2. **Token Usage**: Frontend includes token in `Authorization: Bearer <token>` header
3. **Route Protection**: Middleware validates token and extracts user information
4. **Data Access Control**: Additional middleware ensures users only access their own data

## Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=autotradelk

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 2. Database Setup with Docker

Start the PostgreSQL database using Docker Compose:

```bash
# Start the database
docker-compose up -d

# Check if the container is running
docker-compose ps

# View logs if needed
docker-compose logs postgres
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

```bash
# Development mode
npm run dev

# Build and run production
npm run build
npm start
```

## Logging System

The application uses Winston for structured logging and Morgan for HTTP request logging. **All services and controllers now use service-specific logging** for better debugging and monitoring.

### Service-Specific Logging Implementation

Every service and controller in the application uses service-specific logging with prefixed messages:

#### Services with Service-Specific Logging:

- **AuthService**: `[AuthService]` - User authentication and authorization
- **GoogleAuthService**: `[GoogleAuthService]` - Google OAuth authentication
- **UsersService**: `[UsersService]` - User management operations
- **VehiclesService**: `[VehiclesService]` - Vehicle CRUD operations
- **AuctionsService**: `[AuctionsService]` - Auction and bidding operations
- **DatabaseService**: `[DatabaseService]` - Database connection and operations

#### Controllers with Service-Specific Logging:

- **AuthController**: `[AuthController]` - Authentication endpoints
- **GoogleAuthController**: `[GoogleAuthController]` - Google OAuth endpoints
- **UsersController**: `[UsersController]` - User management endpoints
- **VehiclesController**: `[VehiclesController]` - Vehicle endpoints
- **AuctionsController**: `[AuctionsController]` - Auction endpoints
- **Server**: `[Server]` - Application startup and initialization
- **MorganMiddleware**: `[MorganMiddleware]` - HTTP request logging

### Environment-Based Logging

The logging system automatically adapts based on the `NODE_ENV` environment variable:

#### Development Mode (`NODE_ENV=development`)

- **Log Level**: `debug` (shows all logs)
- **Console Output**: Colored, detailed format with service prefixes
- **Files**: `error.log` + `combined.log`
- **Use Case**: Full debugging, detailed development logs

#### Production Mode (`NODE_ENV=production`)

- **Log Level**: `warn` (shows only errors and warnings)
- **Console Output**: JSON format, no colors
- **Files**: `error.log` only (unless `ENABLE_COMBINED_LOGS=true`)
- **Use Case**: Performance-focused, minimal logging

#### Other Environments (staging, etc.)

- **Log Level**: `info` (shows info, warn, error)
- **Console Output**: JSON format
- **Files**: `error.log` + `combined.log`

### Switching Environments

```bash
# Development (default)
npm run dev

# Production mode
npm run dev:prod

# Or set environment variable
NODE_ENV=production npm run dev

# Enable combined logs in production
ENABLE_COMBINED_LOGS=true NODE_ENV=production npm run dev
```

### Log Levels

- **error**: Critical errors that need immediate attention
- **warn**: Warning messages for potential issues
- **info**: General information about application flow
- **http**: HTTP request/response logging
- **debug**: Detailed debugging information (only in development)

### Log Files

- `logs/error.log`: Contains only error-level logs
- `logs/combined.log`: Contains all log levels (not in production by default)
- Console: Colored output for development, JSON for production

### Service-Specific Logging Examples

#### Console Output (Development):

```
2025-06-24 12:22:24:2224 info: [AuthService] User authentication started
2025-06-24 12:22:24:2224 info: [DatabaseService] Database connection established
2025-06-24 12:22:24:2224 info: [GoogleAuthService] Google OAuth token received
2025-06-24 12:22:24:2224 info: [VehiclesService] Vehicle created successfully
2025-06-24 12:22:24:2224 error: [DatabaseService] Database connection failed
```

#### Filtering by Service:

```bash
# Filter logs by specific service
grep "[AuthService]" logs/combined.log
grep "[DatabaseService]" logs/combined.log
grep "[VehiclesService]" logs/combined.log
grep "[AuctionsService]" logs/combined.log
```

### Usage in Services and Controllers

```typescript
import { createServiceLogger } from "../utils/logger.util";

// In a service
export class MyService {
  private logger = createServiceLogger("MyService");

  async someMethod() {
    this.logger.info("Operation started", { userId: 123 });
    // ... operation logic
    this.logger.info("Operation completed successfully");
  }
}

// In a controller
export class MyController {
  private logger = createServiceLogger("MyController");

  async handleRequest(req: Request, res: Response) {
    this.logger.info("Request received", { method: req.method, url: req.url });
    // ... handle request
    this.logger.info("Request completed successfully");
  }
}
```

### Benefits of Service-Specific Logging

1. **Clear Ownership**: Easy to identify which service generated each log
2. **Targeted Debugging**: Filter logs by specific service for focused debugging
3. **Performance Monitoring**: Track service-specific performance metrics
4. **Error Isolation**: Quickly identify which service caused an issue
5. **Team Collaboration**: Different teams can focus on their service logs
6. **Production Debugging**: Easier to debug issues in production environments

## API Endpoints

- **Authentication**: `/api/auth`
- **Users**: `/api/users`
- **Vehicles**: `/api/vehicles`
- **Auctions**: `/api/auctions`

## Database

The application uses PostgreSQL with TypeORM. The database will be automatically created and tables will be synchronized when you start the application.

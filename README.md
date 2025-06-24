# AutoTradeLK Backend

A Node.js/TypeScript backend for an auto trading platform with PostgreSQL database.

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

The application uses Winston for structured logging and Morgan for HTTP request logging.

### Log Levels

- **error**: Critical errors that need immediate attention
- **warn**: Warning messages for potential issues
- **info**: General information about application flow
- **http**: HTTP request/response logging
- **debug**: Detailed debugging information (only in development)

### Log Files

- `logs/error.log`: Contains only error-level logs
- `logs/combined.log`: Contains all log levels
- Console: Colored output for development

### Usage in Services

```typescript
import logger from "../config/logger";

// Basic logging
logger.info("User created successfully");
logger.error("Database connection failed", error);
logger.debug("Processing request data", { userId: 123 });

// Service-specific logging
import { createServiceLogger } from "../utils/logger.util";
const serviceLogger = createServiceLogger("UserService");
serviceLogger.info("User authentication completed");
```

## API Endpoints

- **Authentication**: `/api/auth`
- **Users**: `/api/users`
- **Vehicles**: `/api/vehicles`
- **Auctions**: `/api/auctions`

## Database

The application uses PostgreSQL with TypeORM. The database will be automatically created and tables will be synchronized when you start the application.

# AutoTradeLK Backend

A Node.js/TypeScript backend for an auto trading platform with PostgreSQL database.

## Features

- **User Authentication**: JWT-based authentication with Google OAuth support
- **Vehicle Management**: CRUD operations with search, filtering, and comparison
- **Auction System**: Create and manage auctions with bidding functionality
- **User Interactions**: Track user behavior for personalized recommendations
- **Brand & Category Management**: Organize vehicles by brands and categories
- **Standardized Error Handling**: Consistent error responses across all endpoints
- **Comprehensive Logging**: Winston-based logging with service-specific loggers
- **Pagination**: Efficient pagination for all list endpoints

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login

### Vehicles

- `GET /api/vehicles` - Get all vehicles with pagination and filtering
- `GET /api/vehicles/:id` - Get vehicle by ID
- `POST /api/vehicles` - Create new vehicle (authenticated)
- `GET /api/vehicles/search` - Search vehicles with advanced filters
- `GET /api/vehicles/compare` - Compare multiple vehicles
- `GET /api/vehicles/:id/suggestions` - Get vehicle suggestions
- `GET /api/vehicles/suggestions/personalized` - Get personalized suggestions (authenticated)

### Auctions

- `GET /api/auctions` - Get all auctions
- `GET /api/auctions/:id` - Get auction by ID
- `POST /api/auctions` - Create new auction (authenticated)
- `POST /api/auctions/:id/bids` - Place a bid (authenticated)
- `GET /api/auctions/:id/bids` - Get auction bids

### Users

- `GET /api/users/:id` - Get user profile (own data only)
- `GET /api/users/:id/vehicles` - Get user's vehicles (own data only)
- `GET /api/users/:id/bids` - Get user's bids (own data only)

### Brands & Categories

- `GET /api/brands` - Get all brands
- `GET /api/categories` - Get all categories
- `GET /api/brands/popular` - Get popular brands
- `GET /api/categories/popular` - Get popular categories

## Database Schema

- **User**: User accounts and profiles
- **Vehicle**: Vehicle listings with detailed specifications
- **Auction**: Auction listings with bidding functionality
- **Bid**: Individual bids on auctions
- **Brand**: Vehicle brands (Honda, Toyota, etc.)
- **Category**: Vehicle categories (Car, SUV, Bike, etc.)
- **UserInteraction**: Track user behavior for recommendations

## Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Environment variables**:
   Create a `.env` file with:

   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_NAME=autotradelk
   JWT_SECRET=your-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   ```

3. **Start PostgreSQL**:

   ```bash
   docker-compose up -d
   ```

4. **Run the application**:

   ```bash
   npm run dev
   ```

5. **Seed the database**:
   ```bash
   npm run seed
   ```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": "Response data",
  "message": "Optional success message",
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Additional error details (optional)",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

## Error Codes

- **Authentication**: `UNAUTHORIZED`, `FORBIDDEN`, `INVALID_TOKEN`, `TOKEN_EXPIRED`
- **Resources**: `NOT_FOUND`, `ALREADY_EXISTS`, `VALIDATION_ERROR`, `INVALID_INPUT`
- **Business Logic**: `AUCTION_ENDED`, `BID_TOO_LOW`, `INSUFFICIENT_FUNDS`, `VEHICLE_NOT_AVAILABLE`
- **System**: `INTERNAL_ERROR`, `DATABASE_ERROR`, `EXTERNAL_SERVICE_ERROR`

## Development

- **TypeScript**: Full TypeScript support with strict type checking
- **TypeORM**: Database ORM with entity relationships
- **Express**: Web framework with middleware support
- **JWT**: JSON Web Token authentication
- **Winston**: Structured logging
- **CORS**: Cross-origin resource sharing

## Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## License

MIT License

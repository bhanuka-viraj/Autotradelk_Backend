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

## API Endpoints

- **Authentication**: `/api/auth`
- **Users**: `/api/users`
- **Vehicles**: `/api/vehicles`
- **Auctions**: `/api/auctions`

## Database

The application uses PostgreSQL with TypeORM. The database will be automatically created and tables will be synchronized when you start the application.

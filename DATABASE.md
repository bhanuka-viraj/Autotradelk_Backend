# Database Management Guide

This document provides comprehensive guidance for managing the AutoTradeLK database across different environments.

## 🏗️ Architecture Overview

The database management system follows a layered approach:

1. **Reference Data** (Locations, Brands, Categories) - Seeded during deployment
2. **User-Generated Content** (Vehicles, Auctions, Bids) - Created by frontend
3. **Environment-Specific Data** - Varies by environment

## 📋 Available Scripts

### Database Initialization

```bash
# Initialize database with reference data only
npm run db:init

# Check database health and statistics
npm run db:check

# Reset database (DANGER: Deletes all data)
npm run db:reset
```

### Environment-Specific Seeding

```bash
# Development environment (full test data)
npm run db:seed-dev

# Production environment (reference data + admin users)
npm run db:seed-prod

# Test environment (minimal test data)
npm run db:seed-test
```

### Convenience Commands

```bash
# Complete development setup
npm run db:setup

# Complete production setup
npm run db:setup-prod

# Complete test setup
npm run db:setup-test
```

## 🌍 Environment-Specific Data

### Production Environment

- **Reference Data**: All locations, brands, categories
- **Admin Users**: System administrator account
- **No Test Data**: Clean production database

### Development Environment

- **Reference Data**: All locations, brands, categories
- **Test Users**: 10+ sample users
- **Test Vehicles**: 15+ sample vehicles
- **Test Auctions**: Sample auctions with bids
- **Test Interactions**: User interaction data

### Test Environment

- **Reference Data**: All locations, brands, categories
- **Minimal Test Data**: 3 users, 5 vehicles, 3 auctions
- **Optimized for Testing**: Fast seeding for CI/CD

## 🚀 Deployment Workflows

### Production Deployment

```bash
# 1. Deploy application
# 2. Run production setup
npm run db:setup-prod

# 3. Start application
npm start
```

### Development Setup

```bash
# Complete development environment
npm run db:setup
```

### CI/CD Pipeline

```bash
# Test environment for automated testing
npm run db:setup-test
```

## 🔧 Database Health Checks

### Check Database Status

```bash
npm run db:check
```

This command provides:

- Connection status
- Table existence verification
- Record counts per table
- Data integrity checks
- Orphaned record detection

### Expected Output

```
┌─────────────┬─────────┐
│ (index)     │ Values  │
├─────────────┼─────────┤
│ connection  │ true    │
│ migrations  │ true    │
│ locations   │ 200+    │
│ brands      │ 10+     │
│ categories  │ 5+      │
│ users       │ 0-15    │
│ vehicles    │ 0-15    │
│ auctions    │ 0-10    │
└─────────────┴─────────┘
```

## 🔒 Security Considerations

### Production Environment

- **Admin Password**: Set via `ADMIN_PASSWORD` environment variable
- **Default Admin**: `admin@autotradelk.com` / `Admin@123`
- **No Test Data**: Prevents data leakage
- **Reference Data Only**: Essential for application functionality

### Environment Variables

```bash
# Required for production
ADMIN_PASSWORD=your_secure_password

# Database configuration
DB_HOST=your_db_host
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_db_password
DB_DATABASE=autotradelk
```

## 📊 Data Structure

### Reference Data (Always Seeded)

- **Locations**: 200+ Sri Lankan locations with 4-level hierarchy:
  - **Provinces** (9 provinces of Sri Lanka)
  - **Districts** (25 districts within provinces)
  - **Cities** (Major cities within districts)
  - **Areas** (Specific areas/neighborhoods within cities)
- **Brands**: 10+ vehicle brands (Toyota, Honda, BMW, etc.)
- **Categories**: 5+ vehicle categories (Cars, SUVs, Trucks, etc.)

### Location Hierarchy Structure

The location system uses a hierarchical structure where each level has a parent-child relationship:

```
Province (e.g., Western Province)
├── District (e.g., Colombo)
    ├── City (e.g., Colombo City)
        ├── Area (e.g., Colombo 7)
        ├── Area (e.g., Colombo 8)
        └── Area (e.g., Colombo 9)
    ├── City (e.g., Dehiwala-Mount Lavinia)
        ├── Area (e.g., Dehiwala)
        ├── Area (e.g., Mount Lavinia)
        └── Area (e.g., Ratmalana)
    └── City (e.g., Sri Jayawardenepura Kotte)
        ├── Area (e.g., Kotte)
        ├── Area (e.g., Nugegoda)
        └── Area (e.g., Maharagama)
```

**Important**: Vehicles and auctions store the **AREA ID** as their location, not province or district IDs. This ensures precise location tracking.

**API Response Format**: When vehicles or auctions are retrieved, the location includes the complete hierarchy:

```json
{
  "location": {
    "id": 10,
    "name": "Colombo 7",
    "type": "area",
    "parent": {
      "id": 3,
      "name": "Colombo City",
      "type": "city",
      "parent": {
        "id": 2,
        "name": "Colombo",
        "type": "district",
        "parent": {
          "id": 1,
          "name": "Western Province",
          "type": "province"
        }
      }
    }
  }
}
```

### Location API Endpoints

- `GET /api/locations/:id` - Get location by ID (includes complete hierarchy)
- `GET /api/locations/:parentId/areas` - Get all areas under a parent (province, district, or city)
- `GET /api/locations/hierarchy` - Get complete location hierarchy
- `GET /api/locations/suggestions?q=query` - Search locations with full path
- `GET /api/locations/type/:type` - Get locations by type (province, district, city, area)

### User-Generated Content (Frontend)

- **Users**: User accounts and profiles
- **Vehicles**: Vehicle listings with details
- **Auctions**: Auction listings
- **Bids**: Auction bids
- **User Interactions**: User behavior tracking

## 🛠️ Troubleshooting

### Common Issues

#### Database Connection Failed

```bash
# Check database status
npm run db:check

# Verify environment variables
echo $DB_HOST $DB_PORT $DB_USERNAME
```

#### Missing Tables

```bash
# Reinitialize database
npm run db:init
```

#### Data Integrity Issues

```bash
# Check for orphaned records
npm run db:check

# Reset and reseed if needed
npm run db:setup
```

### Logs and Debugging

All scripts use structured logging with:

- Environment detection
- Step-by-step progress
- Error details
- Performance metrics

## 📈 Performance Considerations

### Seeding Performance

- **Reference Data**: ~30 seconds
- **Development Data**: ~60 seconds
- **Test Data**: ~15 seconds

### Optimization Tips

- Use SSD storage for database
- Ensure adequate memory allocation
- Monitor connection pool settings
- Use proper indexes (auto-created by TypeORM)

## 🔄 Migration Strategy

### Development

- Uses `synchronize: true` for automatic schema updates
- Fast iteration and testing

### Production

- Uses proper migrations (recommended)
- Manual schema version control
- Rollback capabilities

## 📝 Best Practices

1. **Always backup before major changes**
2. **Test migrations in development first**
3. **Use environment-specific scripts**
4. **Monitor database health regularly**
5. **Document schema changes**
6. **Use proper indexing strategies**
7. **Implement data validation**
8. **Regular integrity checks**

## 🆘 Emergency Procedures

### Database Corruption

```bash
# 1. Stop application
# 2. Backup current state
# 3. Reset database
npm run db:reset

# 4. Reseed appropriate environment
npm run db:setup-prod  # or db:setup-dev
```

### Data Recovery

```bash
# 1. Restore from backup
# 2. Run integrity check
npm run db:check

# 3. Fix any issues found
```

## 📞 Support

For database-related issues:

1. Check logs in `logs/` directory
2. Run `npm run db:check`
3. Review this documentation
4. Contact development team

---

**Last Updated**: December 2024
**Version**: 1.0.0

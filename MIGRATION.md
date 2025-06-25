# Database Script Migration Guide

**✅ MIGRATION COMPLETED** - The legacy `seed.ts` script has been removed.

## 🎉 Current State

The database management system now uses environment-specific scripts exclusively:

```bash
# Environment-specific scripts
npm run db:seed-dev   # Development
npm run db:seed-prod  # Production
npm run db:seed-test  # Test
npm run db:init       # Reference data only
```

## 📋 Available Commands

### **Database Management**

```bash
npm run db:init          # Initialize with reference data
npm run db:check         # Health check and statistics
npm run db:reset         # Reset database (dangerous)
```

### **Environment-Specific Seeding**

```bash
npm run db:seed-dev      # Development (full test data)
npm run db:seed-prod     # Production (reference + admin)
npm run db:seed-test     # Test (minimal data)
```

### **Convenience Commands**

```bash
npm run db:setup         # Complete dev setup
npm run db:setup-prod    # Complete production setup
npm run db:setup-test    # Complete test setup
```

## 🚀 Usage Examples

### **Development Environment**

```bash
# Complete development setup
npm run db:setup

# Or step by step
npm run db:reset
npm run db:seed-dev
```

### **Production Environment**

```bash
# Complete production setup
npm run db:setup-prod

# Or step by step
npm run db:init
npm run db:seed-prod
```

### **Test Environment**

```bash
# Complete test setup
npm run db:setup-test

# Or step by step
npm run db:init
npm run db:seed-test
```

## 📊 Script Comparison

| Feature               | New Environment Scripts |
| --------------------- | ----------------------- |
| **Environment Aware** | ✅ Yes                  |
| **Production Safe**   | ✅ Yes                  |
| **Admin Users**       | ✅ Yes                  |
| **Health Checks**     | ✅ Yes                  |
| **Data Integrity**    | ✅ Yes                  |
| **Performance**       | ✅ Optimized            |

## 🔧 Environment Variables

Make sure to set the correct environment:

```bash
# Development
NODE_ENV=development npm run db:seed-dev

# Production
NODE_ENV=production npm run db:seed-prod

# Test
NODE_ENV=test npm run db:seed-test
```

## 📞 Support

For database-related issues:

1. Check the `DATABASE.md` documentation
2. Run `npm run db:check` to verify database health
3. Review the logs in `logs/` directory
4. Contact the development team

---

**Migration Status**: ✅ **COMPLETED**  
**Legacy Script**: ❌ **REMOVED**

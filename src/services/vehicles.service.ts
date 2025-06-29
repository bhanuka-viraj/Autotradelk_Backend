import { AppDataSource } from "../config/database.config";
import { Vehicle } from "../entities/Vehicle";
import { Location } from "../entities/Location";
import { In } from "typeorm";
import { createServiceLogger } from "../utils/logger.util";
import { UserInteractionsService } from "./user-interactions.service";
import { ApiError, getUserSelectFields } from "../utils/response.util";
import { User } from "../entities/User";

interface FindAllQuery {
  brandId?: number;
  categoryId?: number;
  priceMin?: number;
  priceMax?: number;
  locationId?: number;
  page?: number;
  limit?: number;
}

interface SearchQuery {
  brandId?: number;
  categoryId?: number;
  model?: string;
  priceMin?: number;
  priceMax?: number;
  locationId?: number;
  mileageMax?: number;
  color?: string;
  condition?: string;
  yearMin?: number;
  yearMax?: number;
  fuelType?: string;
  transmission?: string;
  bodyStyle?: string;
  page?: number;
  limit?: number;
}

interface FindAllResponse {
  data: Vehicle[];
  meta: { total: number; page: number; limit: number };
}

interface CreateVehicleData {
  title: string;
  description: string;
  brandId: number;
  categoryId: number;
  model: string;
  year: number;
  mileage: number;
  color: string;
  condition: string;
  price: number;
  locationId: number;
  status: string;
  engineSize?: string;
  fuelType?: string;
  transmission?: string;
  bodyStyle?: string;
  doors?: number;
  seats?: number;
  vin?: string;
  registrationNumber?: string;
  aftermarketParts?: string[];
  missingParts?: string[];
  images: string[];
  userId: number;
}

export class VehiclesService {
  private logger = createServiceLogger("VehiclesService");
  private userInteractionsService = new UserInteractionsService();

  // Helper function to format location hierarchy
  private formatLocationHierarchy(location: Location | null): any {
    if (!location) return null;

    return {
      id: location.id,
      name: location.name,
      nameSinhala: location.nameSinhala,
      nameTamil: location.nameTamil,
      type: location.type,
      code: location.code,
      latitude: location.latitude,
      longitude: location.longitude,
      isActive: location.isActive,
      sortOrder: location.sortOrder,
      createdAt: location.createdAt,
      updatedAt: location.updatedAt,
      parent: this.formatLocationHierarchy(location.parent || null),
    };
  }

  // Helper function to load complete location hierarchy
  private async loadLocationHierarchy(
    locationId: number
  ): Promise<Location | null> {
    if (!locationId) return null;

    const locationRepository = AppDataSource.getRepository(Location);
    return await locationRepository
      .createQueryBuilder("location")
      .leftJoinAndSelect("location.parent", "city")
      .leftJoinAndSelect("city.parent", "district")
      .leftJoinAndSelect("district.parent", "province")
      .where("location.id = :id", { id: locationId })
      .getOne();
  }

  async findAll({
    brandId,
    categoryId,
    priceMin,
    priceMax,
    locationId,
    page = 1,
    limit = 10,
  }: FindAllQuery): Promise<FindAllResponse> {
    this.logger.info("Find all vehicles request", {
      brandId,
      categoryId,
      priceMin,
      priceMax,
      locationId,
      page,
      limit,
    });

    const vehicleRepository = AppDataSource.getRepository(Vehicle);
    const query = vehicleRepository
      .createQueryBuilder("vehicle")
      .leftJoinAndSelect("vehicle.brand", "brand")
      .leftJoinAndSelect("vehicle.category", "category")
      .leftJoinAndSelect("vehicle.location", "location")
      .leftJoinAndSelect("location.parent", "city")
      .leftJoinAndSelect("city.parent", "district")
      .leftJoinAndSelect("district.parent", "province")
      .where("vehicle.status = :status", { status: "available" })
      .skip((page - 1) * limit)
      .take(limit);

    if (brandId) query.andWhere("vehicle.brandId = :brandId", { brandId });
    if (categoryId)
      query.andWhere("vehicle.categoryId = :categoryId", { categoryId });
    if (priceMin) query.andWhere("vehicle.price >= :priceMin", { priceMin });
    if (priceMax) query.andWhere("vehicle.price <= :priceMax", { priceMax });
    if (locationId)
      query.andWhere("vehicle.locationId = :locationId", { locationId });

    const [vehicles, total] = await query.getManyAndCount();

    // Format location hierarchy for each vehicle
    const vehiclesWithHierarchy = vehicles.map((vehicle) => ({
      ...vehicle,
      location: this.formatLocationHierarchy(vehicle.location),
    }));

    this.logger.info("Vehicles retrieved successfully", {
      count: vehiclesWithHierarchy.length,
      total,
      page,
      limit,
    });

    return { data: vehiclesWithHierarchy, meta: { total, page, limit } };
  }

  async findOne(id: number): Promise<Vehicle> {
    this.logger.info("Find vehicle request", { vehicleId: id });

    const vehicleRepository = AppDataSource.getRepository(Vehicle);

    // Use TypeORM's select option to exclude password at query level
    const vehicle = await vehicleRepository
      .createQueryBuilder("vehicle")
      .leftJoinAndSelect("vehicle.brand", "brand")
      .leftJoinAndSelect("vehicle.category", "category")
      .leftJoinAndSelect("vehicle.location", "location")
      .leftJoinAndSelect("location.parent", "city")
      .leftJoinAndSelect("city.parent", "district")
      .leftJoinAndSelect("district.parent", "province")
      .leftJoinAndSelect("vehicle.user", "user")
      .select([
        "vehicle",
        "brand",
        "category",
        "location",
        "city",
        "district",
        "province",
        ...getUserSelectFields(),
      ])
      .where("vehicle.id = :id", { id })
      .getOne();

    if (!vehicle) {
      this.logger.warn("Vehicle not found", { vehicleId: id });
      throw ApiError.notFound("Vehicle");
    }

    // Format location hierarchy
    const vehicleWithHierarchy = {
      ...vehicle,
      location: this.formatLocationHierarchy(vehicle.location),
    };

    this.logger.info("Vehicle retrieved successfully", { vehicleId: id });
    return vehicleWithHierarchy;
  }

  async getVehicleSuggestions(
    id: number,
    limit: number = 4
  ): Promise<Vehicle[]> {
    this.logger.info("Get vehicle suggestions request", {
      vehicleId: id,
      limit,
    });

    const vehicleRepository = AppDataSource.getRepository(Vehicle);
    const vehicle = await vehicleRepository.findOne({
      where: { id },
      relations: ["brand", "category"],
    });

    if (!vehicle) {
      this.logger.warn("Vehicle not found for suggestions", { vehicleId: id });
      throw ApiError.notFound("Vehicle");
    }

    const priceRange = {
      min: vehicle.price * 0.9,
      max: vehicle.price * 1.1,
    };

    const suggestions = await vehicleRepository
      .createQueryBuilder("vehicle")
      .leftJoinAndSelect("vehicle.brand", "brand")
      .leftJoinAndSelect("vehicle.category", "category")
      .leftJoinAndSelect("vehicle.location", "location")
      .leftJoinAndSelect("location.parent", "city")
      .leftJoinAndSelect("city.parent", "district")
      .leftJoinAndSelect("district.parent", "province")
      .where("vehicle.id != :id", { id })
      .andWhere("vehicle.status = :status", { status: "available" })
      .andWhere("vehicle.price BETWEEN :min AND :max", {
        min: priceRange.min,
        max: priceRange.max,
      })
      .andWhere("vehicle.brandId = :brandId OR vehicle.model = :model", {
        brandId: vehicle.brand.id,
        model: vehicle.model,
      })
      .orderBy("vehicle.createdAt", "DESC")
      .take(limit)
      .getMany();

    // Format location hierarchy for suggestions
    const suggestionsWithHierarchy = suggestions.map((vehicle) => ({
      ...vehicle,
      location: this.formatLocationHierarchy(vehicle.location),
    }));

    this.logger.info("Vehicle suggestions retrieved successfully", {
      vehicleId: id,
      suggestionCount: suggestionsWithHierarchy.length,
    });

    return suggestionsWithHierarchy;
  }

  async getUserSpecificSuggestions(
    userId: number,
    vehicleId?: number,
    limit: number = 8
  ): Promise<Vehicle[]> {
    this.logger.info("Get user-specific vehicle suggestions", {
      userId,
      vehicleId,
      limit,
    });

    const vehicleRepository = AppDataSource.getRepository(Vehicle);

    // Get user preferences
    const preferences = await this.userInteractionsService.getUserPreferences(
      userId
    );

    // Get recently viewed vehicles to avoid suggesting them again
    const recentlyViewed =
      await this.userInteractionsService.getRecentlyViewedVehicles(userId, 20);

    // Build query based on user preferences
    const query = vehicleRepository
      .createQueryBuilder("vehicle")
      .leftJoinAndSelect("vehicle.location", "location")
      .leftJoinAndSelect("location.parent", "city")
      .leftJoinAndSelect("city.parent", "district")
      .leftJoinAndSelect("district.parent", "province")
      .where("vehicle.status = :status", { status: "available" })
      .andWhere("vehicle.id NOT IN (:...recentlyViewed)", {
        recentlyViewed: recentlyViewed.length > 0 ? recentlyViewed : [0],
      });

    // Apply user preferences with weighted scoring
    let hasPreferences = false;

    // Brand preferences (highest weight)
    if (preferences.preferredBrands.length > 0) {
      query.andWhere("vehicle.brand IN (:...brands)", {
        brands: preferences.preferredBrands,
      });
      hasPreferences = true;
    }

    // Model preferences (high weight)
    if (preferences.preferredModels.length > 0) {
      query.orWhere("vehicle.model IN (:...models)", {
        models: preferences.preferredModels,
      });
      hasPreferences = true;
    }

    // Price range preferences
    if (preferences.priceRange.min > 0 && preferences.priceRange.max > 0) {
      query.andWhere("vehicle.price BETWEEN :minPrice AND :maxPrice", {
        minPrice: preferences.priceRange.min,
        maxPrice: preferences.priceRange.max,
      });
      hasPreferences = true;
    }

    // Location preferences
    if (preferences.preferredLocations.length > 0) {
      query.andWhere("vehicle.locationId IN (:...locations)", {
        locations: preferences.preferredLocations,
      });
      hasPreferences = true;
    }

    // Year preferences
    if (
      preferences.preferredYears.min > 0 &&
      preferences.preferredYears.max > 0
    ) {
      query.andWhere("vehicle.year BETWEEN :minYear AND :maxYear", {
        minYear: preferences.preferredYears.min,
        maxYear: preferences.preferredYears.max,
      });
      hasPreferences = true;
    }

    // Condition preferences
    if (preferences.preferredConditions.length > 0) {
      query.andWhere("vehicle.condition IN (:...conditions)", {
        conditions: preferences.preferredConditions,
      });
      hasPreferences = true;
    }

    // If no user preferences, fall back to general suggestions
    if (!hasPreferences) {
      this.logger.info("No user preferences found, using general suggestions", {
        userId,
      });

      // Get some popular vehicles as fallback
      const fallbackSuggestions = await vehicleRepository
        .createQueryBuilder("vehicle")
        .leftJoinAndSelect("vehicle.location", "location")
        .leftJoinAndSelect("location.parent", "city")
        .leftJoinAndSelect("city.parent", "district")
        .leftJoinAndSelect("district.parent", "province")
        .where("vehicle.status = :status", { status: "available" })
        .andWhere("vehicle.id NOT IN (:...recentlyViewed)", {
          recentlyViewed: recentlyViewed.length > 0 ? recentlyViewed : [0],
        })
        .orderBy("vehicle.createdAt", "DESC")
        .take(limit)
        .getMany();

      // Format location hierarchy for fallback suggestions
      const fallbackWithHierarchy = fallbackSuggestions.map((vehicle) => ({
        ...vehicle,
        location: this.formatLocationHierarchy(vehicle.location),
      }));

      this.logger.info("Fallback suggestions retrieved", {
        userId,
        suggestionCount: fallbackWithHierarchy.length,
      });

      return fallbackWithHierarchy;
    }

    // Add scoring based on preference matches
    query
      .addSelect(
        `
      CASE 
        WHEN vehicle.brand IN (:...preferredBrands) THEN 10
        ELSE 0
      END +
      CASE 
        WHEN vehicle.model IN (:...preferredModels) THEN 8
        ELSE 0
      END +
      CASE 
        WHEN vehicle.locationId IN (:...preferredLocations) THEN 5
        ELSE 0
      END +
      CASE 
        WHEN vehicle.condition IN (:...preferredConditions) THEN 3
        ELSE 0
      END
    `,
        "preference_score"
      )
      .setParameter("preferredBrands", preferences.preferredBrands)
      .setParameter("preferredModels", preferences.preferredModels)
      .setParameter("preferredLocations", preferences.preferredLocations)
      .setParameter("preferredConditions", preferences.preferredConditions)
      .orderBy("preference_score", "DESC")
      .addOrderBy("vehicle.createdAt", "DESC")
      .take(limit);

    const suggestions = await query.getMany();

    // Format location hierarchy for suggestions
    const suggestionsWithHierarchy = suggestions.map((vehicle) => ({
      ...vehicle,
      location: this.formatLocationHierarchy(vehicle.location),
    }));

    this.logger.info("User-specific suggestions retrieved successfully", {
      userId,
      suggestionCount: suggestionsWithHierarchy.length,
      hasPreferences,
    });

    return suggestionsWithHierarchy;
  }

  async compareVehicles(ids: number[]): Promise<Vehicle[]> {
    this.logger.info("Compare vehicles request", { vehicleIds: ids });

    const vehicleRepository = AppDataSource.getRepository(Vehicle);
    const vehicles = await vehicleRepository
      .createQueryBuilder("vehicle")
      .leftJoinAndSelect("vehicle.brand", "brand")
      .leftJoinAndSelect("vehicle.category", "category")
      .leftJoinAndSelect("vehicle.location", "location")
      .leftJoinAndSelect("location.parent", "city")
      .leftJoinAndSelect("city.parent", "district")
      .leftJoinAndSelect("district.parent", "province")
      .leftJoinAndSelect("vehicle.user", "user")
      .select([
        "vehicle",
        "brand",
        "category",
        "location",
        "city",
        "district",
        "province",
        ...getUserSelectFields(),
      ])
      .where("vehicle.id IN (:...ids)", { ids })
      .getMany();

    if (vehicles.length !== ids.length) {
      this.logger.warn("One or more vehicles not found for comparison", {
        requestedIds: ids,
        foundIds: vehicles.map((v) => v.id),
      });
      throw ApiError.notFound("One or more vehicles");
    }

    // Format location hierarchy for comparison
    const vehiclesWithHierarchy = vehicles.map((vehicle) => ({
      ...vehicle,
      location: this.formatLocationHierarchy(vehicle.location),
    }));

    this.logger.info("Vehicle comparison completed successfully", {
      vehicleCount: vehiclesWithHierarchy.length,
    });

    return vehiclesWithHierarchy;
  }

  async create(data: CreateVehicleData): Promise<Vehicle> {
    this.logger.info("Create vehicle request", {
      userId: data.userId,
      brandId: data.brandId,
      categoryId: data.categoryId,
      model: data.model,
    });

    const vehicleRepository = AppDataSource.getRepository(Vehicle);

    const vehicle = vehicleRepository.create({
      title: data.title,
      description: data.description,
      brand: { id: data.brandId },
      category: { id: data.categoryId },
      model: data.model,
      year: data.year,
      mileage: data.mileage,
      color: data.color,
      condition: data.condition,
      price: data.price,
      location: { id: data.locationId },
      status: data.status,
      engineSize: data.engineSize,
      fuelType: data.fuelType,
      transmission: data.transmission,
      bodyStyle: data.bodyStyle,
      doors: data.doors,
      seats: data.seats,
      vin: data.vin,
      registrationNumber: data.registrationNumber,
      aftermarketParts: data.aftermarketParts || null,
      missingParts: data.missingParts || null,
      images: data.images,
      user: { id: data.userId },
    });

    await vehicleRepository.save(vehicle);

    this.logger.info("Vehicle created successfully", {
      vehicleId: vehicle.id,
      userId: data.userId,
      categoryId: data.categoryId,
    });

    return vehicle;
  }

  async search({
    brandId,
    categoryId,
    model,
    priceMin,
    priceMax,
    locationId,
    mileageMax,
    color,
    condition,
    yearMin,
    yearMax,
    fuelType,
    transmission,
    bodyStyle,
    page = 1,
    limit = 10,
  }: SearchQuery): Promise<FindAllResponse> {
    this.logger.info("Search vehicles request", {
      brandId,
      categoryId,
      model,
      priceMin,
      priceMax,
      locationId,
      mileageMax,
      color,
      condition,
      yearMin,
      yearMax,
      fuelType,
      transmission,
      bodyStyle,
      page,
      limit,
    });

    const vehicleRepository = AppDataSource.getRepository(Vehicle);
    const query = vehicleRepository
      .createQueryBuilder("vehicle")
      .leftJoinAndSelect("vehicle.brand", "brand")
      .leftJoinAndSelect("vehicle.category", "category")
      .leftJoinAndSelect("vehicle.location", "location")
      .leftJoinAndSelect("location.parent", "city")
      .leftJoinAndSelect("city.parent", "district")
      .leftJoinAndSelect("district.parent", "province")
      .where("vehicle.status = :status", { status: "available" })
      .skip((page - 1) * limit)
      .take(limit);

    if (brandId) query.andWhere("vehicle.brandId = :brandId", { brandId });
    if (categoryId)
      query.andWhere("vehicle.categoryId = :categoryId", { categoryId });
    if (model) query.andWhere("vehicle.model = :model", { model });
    if (priceMin) query.andWhere("vehicle.price >= :priceMin", { priceMin });
    if (priceMax) query.andWhere("vehicle.price <= :priceMax", { priceMax });
    if (locationId)
      query.andWhere("vehicle.locationId = :locationId", { locationId });
    if (mileageMax)
      query.andWhere("vehicle.mileage <= :mileageMax", { mileageMax });
    if (color) query.andWhere("vehicle.color = :color", { color });
    if (condition)
      query.andWhere("vehicle.condition = :condition", { condition });
    if (yearMin) query.andWhere("vehicle.year >= :yearMin", { yearMin });
    if (yearMax) query.andWhere("vehicle.year <= :yearMax", { yearMax });
    if (fuelType) query.andWhere("vehicle.fuelType = :fuelType", { fuelType });
    if (transmission)
      query.andWhere("vehicle.transmission = :transmission", { transmission });
    if (bodyStyle)
      query.andWhere("vehicle.bodyStyle = :bodyStyle", { bodyStyle });

    const [vehicles, total] = await query.getManyAndCount();

    // Format location hierarchy for search results
    const vehiclesWithHierarchy = vehicles.map((vehicle) => ({
      ...vehicle,
      location: this.formatLocationHierarchy(vehicle.location),
    }));

    this.logger.info("Vehicle search completed successfully", {
      count: vehiclesWithHierarchy.length,
      total,
      page,
      limit,
    });

    return { data: vehiclesWithHierarchy, meta: { total, page, limit } };
  }
}

import { AppDataSource } from "../config/database.config";
import { Location, LocationType } from "../entities/Location";
import { createServiceLogger } from "../utils/logger.util";
import { ApiError } from "../utils/response.util";
import { Like, In } from "typeorm";

interface LocationSuggestion {
  id: number;
  name: string;
  nameSinhala?: string;
  nameTamil?: string;
  type: LocationType;
  fullPath: string;
  code?: string;
}

interface LocationHierarchy {
  id: number;
  name: string;
  type: LocationType;
  children?: LocationHierarchy[];
}

interface SearchLocationQuery {
  query: string;
  type?: LocationType;
  parentId?: number;
  limit?: number;
}

export class LocationsService {
  private logger = createServiceLogger("LocationsService");

  async getSuggestions(
    query: string,
    limit: number = 10
  ): Promise<LocationSuggestion[]> {
    this.logger.info("Get location suggestions", { query, limit });

    const locationRepository = AppDataSource.getRepository(Location);

    // Search by name (case-insensitive)
    const locations = await locationRepository
      .createQueryBuilder("location")
      .leftJoinAndSelect("location.parent", "city")
      .leftJoinAndSelect("city.parent", "district")
      .leftJoinAndSelect("district.parent", "province")
      .where("location.isActive = :isActive", { isActive: true })
      .andWhere(
        "(location.name ILIKE :query OR location.nameSinhala ILIKE :query OR location.nameTamil ILIKE :query)",
        {
          query: `%${query}%`,
        }
      )
      .orderBy("location.sortOrder", "ASC")
      .addOrderBy("location.name", "ASC")
      .take(limit)
      .getMany();

    const suggestions: LocationSuggestion[] = locations.map((location) => {
      const pathParts = [];
      if (location.parent?.parent?.parent?.name)
        pathParts.push(location.parent.parent.parent.name); // Province
      if (location.parent?.parent?.name)
        pathParts.push(location.parent.parent.name); // District
      if (location.parent?.name) pathParts.push(location.parent.name); // City
      pathParts.push(location.name); // Area

      return {
        id: location.id,
        name: location.name,
        nameSinhala: location.nameSinhala,
        nameTamil: location.nameTamil,
        type: location.type,
        fullPath: pathParts.join(", "),
        code: location.code,
      };
    });

    this.logger.info("Location suggestions retrieved", {
      query,
      suggestionCount: suggestions.length,
    });

    return suggestions;
  }

  async getHierarchy(): Promise<LocationHierarchy[]> {
    this.logger.info("Get location hierarchy");

    const locationRepository = AppDataSource.getRepository(Location);

    const provinces = await locationRepository
      .createQueryBuilder("province")
      .leftJoinAndSelect("province.children", "districts")
      .leftJoinAndSelect("districts.children", "cities")
      .leftJoinAndSelect("cities.children", "areas")
      .where("province.type = :type", { type: LocationType.PROVINCE })
      .andWhere("province.isActive = :isActive", { isActive: true })
      .orderBy("province.sortOrder", "ASC")
      .addOrderBy("province.name", "ASC")
      .getMany();

    const hierarchy: LocationHierarchy[] = provinces.map((province) => ({
      id: province.id,
      name: province.name,
      type: province.type,
      children: province.children?.map((district) => ({
        id: district.id,
        name: district.name,
        type: district.type,
        children: district.children?.map((city) => ({
          id: city.id,
          name: city.name,
          type: city.type,
          children: city.children?.map((area) => ({
            id: area.id,
            name: area.name,
            type: area.type,
          })),
        })),
      })),
    }));

    this.logger.info("Location hierarchy retrieved", {
      provinceCount: hierarchy.length,
    });

    return hierarchy;
  }

  async findById(id: number): Promise<Location> {
    this.logger.info("Find location by ID", { locationId: id });

    const locationRepository = AppDataSource.getRepository(Location);
    const location = await locationRepository
      .createQueryBuilder("location")
      .leftJoinAndSelect("location.parent", "city")
      .leftJoinAndSelect("city.parent", "district")
      .leftJoinAndSelect("district.parent", "province")
      .leftJoinAndSelect("location.children", "children")
      .where("location.id = :id", { id })
      .andWhere("location.isActive = :isActive", { isActive: true })
      .getOne();

    if (!location) {
      this.logger.warn("Location not found", { locationId: id });
      throw ApiError.notFound("Location");
    }

    this.logger.info("Location found", { locationId: id, name: location.name });
    return location;
  }

  async findByType(type: LocationType, parentId?: number): Promise<Location[]> {
    this.logger.info("Find locations by type", { type, parentId });

    const locationRepository = AppDataSource.getRepository(Location);
    const query = locationRepository
      .createQueryBuilder("location")
      .where("location.type = :type", { type })
      .andWhere("location.isActive = :isActive", { isActive: true });

    if (parentId) {
      query.andWhere("location.parentId = :parentId", { parentId });
    }

    const locations = await query
      .orderBy("location.sortOrder", "ASC")
      .addOrderBy("location.name", "ASC")
      .getMany();

    this.logger.info("Locations by type retrieved", {
      type,
      parentId,
      count: locations.length,
    });

    return locations;
  }

  async getPopularLocations(limit: number = 10): Promise<Location[]> {
    this.logger.info("Get popular locations", { limit });

    const locationRepository = AppDataSource.getRepository(Location);

    // Get locations with most vehicles/auctions
    const popularLocations = await locationRepository
      .createQueryBuilder("location")
      .leftJoin("location.vehicles", "vehicles")
      .leftJoin("location.auctions", "auctions")
      .addSelect(
        "COUNT(DISTINCT vehicles.id) + COUNT(DISTINCT auctions.id)",
        "activity_count"
      )
      .where("location.isActive = :isActive", { isActive: true })
      .groupBy("location.id")
      .orderBy("activity_count", "DESC")
      .addOrderBy("location.name", "ASC")
      .take(limit)
      .getMany();

    this.logger.info("Popular locations retrieved", {
      count: popularLocations.length,
    });

    return popularLocations;
  }

  async searchLocations({
    query,
    type,
    parentId,
    limit = 20,
  }: SearchLocationQuery): Promise<Location[]> {
    this.logger.info("Search locations", { query, type, parentId, limit });

    const locationRepository = AppDataSource.getRepository(Location);
    const queryBuilder = locationRepository
      .createQueryBuilder("location")
      .leftJoinAndSelect("location.parent", "city")
      .leftJoinAndSelect("city.parent", "district")
      .leftJoinAndSelect("district.parent", "province")
      .where("location.isActive = :isActive", { isActive: true });

    if (query) {
      queryBuilder.andWhere(
        "(location.name ILIKE :query OR location.nameSinhala ILIKE :query OR location.nameTamil ILIKE :query)",
        { query: `%${query}%` }
      );
    }

    if (type) {
      queryBuilder.andWhere("location.type = :type", { type });
    }

    if (parentId) {
      queryBuilder.andWhere("location.parentId = :parentId", { parentId });
    }

    const locations = await queryBuilder
      .orderBy("location.sortOrder", "ASC")
      .addOrderBy("location.name", "ASC")
      .take(limit)
      .getMany();

    this.logger.info("Location search completed", {
      query,
      type,
      parentId,
      count: locations.length,
    });

    return locations;
  }

  async validateLocation(locationId: number): Promise<boolean> {
    this.logger.info("Validate location", { locationId });

    const locationRepository = AppDataSource.getRepository(Location);
    const location = await locationRepository.findOne({
      where: { id: locationId, isActive: true },
    });

    const isValid = !!location;

    this.logger.info("Location validation result", { locationId, isValid });
    return isValid;
  }

  async getAreasByParent(parentId: number): Promise<Location[]> {
    this.logger.info("Get areas by parent", { parentId });

    const locationRepository = AppDataSource.getRepository(Location);

    // First, get the parent location to understand its type
    const parentLocation = await locationRepository.findOne({
      where: { id: parentId, isActive: true },
    });

    if (!parentLocation) {
      this.logger.warn("Parent location not found", { parentId });
      throw ApiError.notFound("Parent location");
    }

    let areas: Location[] = [];

    switch (parentLocation.type) {
      case LocationType.PROVINCE:
        // Get all areas in this province
        areas = await locationRepository
          .createQueryBuilder("area")
          .leftJoinAndSelect("area.parent", "city")
          .leftJoinAndSelect("city.parent", "district")
          .where("area.type = :areaType", { areaType: LocationType.AREA })
          .andWhere("area.isActive = :isActive", { isActive: true })
          .andWhere("district.parentId = :provinceId", { provinceId: parentId })
          .orderBy("area.sortOrder", "ASC")
          .addOrderBy("area.name", "ASC")
          .getMany();
        break;

      case LocationType.DISTRICT:
        // Get all areas in this district
        areas = await locationRepository
          .createQueryBuilder("area")
          .leftJoinAndSelect("area.parent", "city")
          .where("area.type = :areaType", { areaType: LocationType.AREA })
          .andWhere("area.isActive = :isActive", { isActive: true })
          .andWhere("city.parentId = :districtId", { districtId: parentId })
          .orderBy("area.sortOrder", "ASC")
          .addOrderBy("area.name", "ASC")
          .getMany();
        break;

      case LocationType.CITY:
        // Get all areas in this city
        areas = await locationRepository
          .createQueryBuilder("area")
          .where("area.type = :areaType", { areaType: LocationType.AREA })
          .andWhere("area.isActive = :isActive", { isActive: true })
          .andWhere("area.parentId = :cityId", { cityId: parentId })
          .orderBy("area.sortOrder", "ASC")
          .addOrderBy("area.name", "ASC")
          .getMany();
        break;

      default:
        this.logger.warn("Invalid parent location type", {
          parentId,
          type: parentLocation.type,
        });
        throw new Error("Invalid parent location type");
    }

    this.logger.info("Areas by parent retrieved", {
      parentId,
      parentType: parentLocation.type,
      areaCount: areas.length,
    });

    return areas;
  }
}

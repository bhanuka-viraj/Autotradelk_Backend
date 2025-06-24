import { AppDataSource } from "../config/database.config";
import { UserInteraction, InteractionType } from "../entities/UserInteraction";
import { createServiceLogger } from "../utils/logger.util";

interface TrackInteractionData {
  userId: number;
  vehicleId?: number;
  interactionType: InteractionType;
  metadata?: {
    searchQuery?: string;
    priceRange?: { min: number; max: number };
    location?: string;
    filters?: Record<string, any>;
    duration?: number;
  };
}

interface UserPreferences {
  preferredBrands: string[];
  preferredModels: string[];
  priceRange: { min: number; max: number };
  preferredLocations: string[];
  preferredYears: { min: number; max: number };
  preferredConditions: string[];
}

export class UserInteractionsService {
  private logger = createServiceLogger("UserInteractionsService");

  async trackInteraction(data: TrackInteractionData): Promise<UserInteraction> {
    this.logger.info("Track user interaction", {
      userId: data.userId,
      vehicleId: data.vehicleId,
      interactionType: data.interactionType,
    });

    const interactionRepository = AppDataSource.getRepository(UserInteraction);
    const interaction = interactionRepository.create({
      userId: data.userId,
      vehicleId: data.vehicleId,
      interactionType: data.interactionType,
      metadata: data.metadata,
    });

    await interactionRepository.save(interaction);

    this.logger.info("User interaction tracked successfully", {
      interactionId: interaction.id,
      userId: data.userId,
    });

    return interaction;
  }

  async getUserPreferences(
    userId: number,
    daysBack: number = 30
  ): Promise<UserPreferences> {
    this.logger.info("Get user preferences", { userId, daysBack });

    const interactionRepository = AppDataSource.getRepository(UserInteraction);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);

    // Get recent interactions
    const interactions = await interactionRepository
      .createQueryBuilder("interaction")
      .leftJoinAndSelect("interaction.vehicle", "vehicle")
      .where("interaction.userId = :userId", { userId })
      .andWhere("interaction.createdAt >= :cutoffDate", { cutoffDate })
      .orderBy("interaction.createdAt", "DESC")
      .getMany();

    // Analyze preferences from interactions
    const preferences: UserPreferences = {
      preferredBrands: [],
      preferredModels: [],
      priceRange: { min: 0, max: 0 },
      preferredLocations: [],
      preferredYears: { min: 0, max: 0 },
      preferredConditions: [],
    };

    const brandCounts: Record<string, number> = {};
    const modelCounts: Record<string, number> = {};
    const prices: number[] = [];
    const locations: Record<string, number> = {};
    const years: number[] = [];
    const conditions: Record<string, number> = {};

    // Process vehicle interactions
    interactions.forEach((interaction) => {
      if (interaction.vehicle) {
        // Count brands
        brandCounts[interaction.vehicle.brand.name] =
          (brandCounts[interaction.vehicle.brand.name] || 0) + 1;

        // Count models
        modelCounts[interaction.vehicle.model] =
          (modelCounts[interaction.vehicle.model] || 0) + 1;

        // Collect prices
        prices.push(interaction.vehicle.price);

        // Count locations
        locations[interaction.vehicle.location] =
          (locations[interaction.vehicle.location] || 0) + 1;

        // Collect years
        years.push(interaction.vehicle.year);

        // Count conditions
        conditions[interaction.vehicle.condition] =
          (conditions[interaction.vehicle.condition] || 0) + 1;
      }

      // Process search metadata
      if (interaction.metadata?.searchQuery) {
        // Extract brand/model from search query
        const query = interaction.metadata.searchQuery.toLowerCase();
        if (query.includes("toyota"))
          brandCounts["Toyota"] = (brandCounts["Toyota"] || 0) + 1;
        if (query.includes("honda"))
          brandCounts["Honda"] = (brandCounts["Honda"] || 0) + 1;
        if (query.includes("bmw"))
          brandCounts["BMW"] = (brandCounts["BMW"] || 0) + 1;
        if (query.includes("mercedes"))
          brandCounts["Mercedes"] = (brandCounts["Mercedes"] || 0) + 1;
        if (query.includes("audi"))
          brandCounts["Audi"] = (brandCounts["Audi"] || 0) + 1;
        if (query.includes("ford"))
          brandCounts["Ford"] = (brandCounts["Ford"] || 0) + 1;
        if (query.includes("nissan"))
          brandCounts["Nissan"] = (brandCounts["Nissan"] || 0) + 1;
        if (query.includes("hyundai"))
          brandCounts["Hyundai"] = (brandCounts["Hyundai"] || 0) + 1;
        if (query.includes("kia"))
          brandCounts["Kia"] = (brandCounts["Kia"] || 0) + 1;
        if (query.includes("mazda"))
          brandCounts["Mazda"] = (brandCounts["Mazda"] || 0) + 1;
      }

      // Process price range from metadata
      if (interaction.metadata?.priceRange) {
        prices.push(
          interaction.metadata.priceRange.min,
          interaction.metadata.priceRange.max
        );
      }

      // Process location from metadata
      if (interaction.metadata?.location) {
        locations[interaction.metadata.location] =
          (locations[interaction.metadata.location] || 0) + 1;
      }
    });

    // Set preferences based on analysis
    if (prices.length > 0) {
      preferences.priceRange = {
        min: Math.min(...prices) * 0.8, // 20% buffer below
        max: Math.max(...prices) * 1.2, // 20% buffer above
      };
    }

    if (years.length > 0) {
      preferences.preferredYears = {
        min: Math.min(...years) - 2, // 2 years buffer below
        max: Math.max(...years) + 2, // 2 years buffer above
      };
    }

    // Get top brands (top 5)
    preferences.preferredBrands = Object.entries(brandCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([brand]) => brand);

    // Get top models (top 10)
    preferences.preferredModels = Object.entries(modelCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([model]) => model);

    // Get top locations (top 3)
    preferences.preferredLocations = Object.entries(locations)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([location]) => location);

    // Get top conditions (top 3)
    preferences.preferredConditions = Object.entries(conditions)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([condition]) => condition);

    this.logger.info("User preferences analyzed successfully", {
      userId,
      brandCount: preferences.preferredBrands.length,
      modelCount: preferences.preferredModels.length,
      locationCount: preferences.preferredLocations.length,
    });

    return preferences;
  }

  async getRecentlyViewedVehicles(
    userId: number,
    limit: number = 10
  ): Promise<number[]> {
    this.logger.info("Get recently viewed vehicles", { userId, limit });

    const interactionRepository = AppDataSource.getRepository(UserInteraction);
    const interactions = await interactionRepository
      .createQueryBuilder("interaction")
      .where("interaction.userId = :userId", { userId })
      .andWhere("interaction.interactionType = :type", {
        type: InteractionType.VIEW,
      })
      .andWhere("interaction.vehicleId IS NOT NULL")
      .orderBy("interaction.createdAt", "DESC")
      .take(limit)
      .getMany();

    const vehicleIds = interactions.map((i) => i.vehicleId!);

    this.logger.info("Recently viewed vehicles retrieved", {
      userId,
      vehicleCount: vehicleIds.length,
    });

    return vehicleIds;
  }
}

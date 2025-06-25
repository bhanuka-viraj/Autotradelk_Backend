import { AppDataSource } from "../config/database.config";
import { Category } from "../entities/Category";
import { createServiceLogger } from "../utils/logger.util";

const logger = createServiceLogger("CategoriesSeed");

const categories = [
  // Level 0 - Main Categories
  { name: "Cars", description: "Passenger vehicles", level: 0, sortOrder: 1 },
  {
    name: "Motorcycles",
    description: "Two-wheeled vehicles",
    level: 0,
    sortOrder: 2,
  },
  {
    name: "Trucks",
    description: "Commercial vehicles",
    level: 0,
    sortOrder: 3,
  },
  {
    name: "SUVs",
    description: "Sport utility vehicles",
    level: 0,
    sortOrder: 4,
  },
  {
    name: "Buses",
    description: "Public transport vehicles",
    level: 0,
    sortOrder: 5,
  },
  { name: "Trailers", description: "Towed vehicles", level: 0, sortOrder: 6 },
  { name: "Boats", description: "Watercraft", level: 0, sortOrder: 7 },
  { name: "Aircraft", description: "Flying vehicles", level: 0, sortOrder: 8 },
  {
    name: "Heavy Equipment",
    description: "Construction and industrial vehicles",
    level: 0,
    sortOrder: 9,
  },
  {
    name: "Recreational Vehicles",
    description: "RV and camping vehicles",
    level: 0,
    sortOrder: 10,
  },
  {
    name: "Classic & Vintage",
    description: "Antique and classic vehicles",
    level: 0,
    sortOrder: 11,
  },
  {
    name: "Electric",
    description: "EV and hybrid vehicles",
    level: 0,
    sortOrder: 12,
  },
  {
    name: "Luxury Vehicles",
    description: "High-end premium vehicles",
    level: 0,
    sortOrder: 13,
  },
  {
    name: "Sports",
    description: "High-performance vehicles",
    level: 0,
    sortOrder: 14,
  },
  {
    name: "Off-Road Vehicles",
    description: "4x4 and adventure vehicles",
    level: 0,
    sortOrder: 15,
  },
  {
    name: "Utility Vehicles",
    description: "Work and utility vehicles",
    level: 0,
    sortOrder: 16,
  },
  {
    name: "Agricultural Vehicles",
    description: "Farming and agricultural vehicles",
    level: 0,
    sortOrder: 17,
  },
  {
    name: "Emergency Vehicles",
    description: "Police, fire, and emergency vehicles",
    level: 0,
    sortOrder: 18,
  },
  {
    name: "Military Vehicles",
    description: "Military and defense vehicles",
    level: 0,
    sortOrder: 19,
  },
  {
    name: "Racing Vehicles",
    description: "Professional racing vehicles",
    level: 0,
    sortOrder: 20,
  },
  {
    name: "Custom Vehicles",
    description: "Custom-built and modified vehicles",
    level: 0,
    sortOrder: 21,
  },
];

export async function seedCategories(): Promise<Category[]> {
  try {
    logger.info("Starting categories seeding...");

    const categoryRepository = AppDataSource.getRepository(Category);

    // Check if categories already exist
    const existingCount = await categoryRepository.count();
    if (existingCount > 0) {
      logger.info(
        `Categories already exist (${existingCount} categories), skipping seeding`
      );
      return await categoryRepository.find();
    }

    // Create categories
    const createdCategories = [];
    for (const categoryData of categories) {
      const category = categoryRepository.create(categoryData);
      const savedCategory = await categoryRepository.save(category);
      createdCategories.push(savedCategory);
      logger.info(`Created category: ${savedCategory.name}`);
    }

    logger.info("Categories seeding completed successfully", {
      categoryCount: createdCategories.length,
    });

    return createdCategories;
  } catch (error) {
    logger.error("Error seeding categories", { error });
    throw error;
  }
}

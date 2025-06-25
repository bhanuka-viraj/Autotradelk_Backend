import { AppDataSource } from "../config/database.config";
import { UserInteraction, InteractionType } from "../entities/UserInteraction";
import { User } from "../entities/User";
import { Vehicle } from "../entities/Vehicle";
import { createServiceLogger } from "../utils/logger.util";

const logger = createServiceLogger("UserInteractionsSeed");

export async function seedUserInteractions(
  users: User[],
  vehicles: Vehicle[]
): Promise<UserInteraction[]> {
  try {
    logger.info("Starting user interactions seeding...");

    const userInteractionRepository =
      AppDataSource.getRepository(UserInteraction);

    // Create user interactions
    const createdUserInteractions: UserInteraction[] = [];
    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < vehicles.length; j++) {
        // Each user views and favorites each vehicle
        const viewInteraction = userInteractionRepository.create({
          userId: users[i].id,
          vehicleId: vehicles[j].id,
          interactionType: InteractionType.VIEW,
          metadata: { duration: Math.floor(Math.random() * 120) + 10 },
        });
        const savedViewInteraction = await userInteractionRepository.save(
          viewInteraction
        );
        createdUserInteractions.push(savedViewInteraction);

        const favoriteInteraction = userInteractionRepository.create({
          userId: users[i].id,
          vehicleId: vehicles[j].id,
          interactionType: InteractionType.FAVORITE,
          metadata: {},
        });
        const savedFavoriteInteraction = await userInteractionRepository.save(
          favoriteInteraction
        );
        createdUserInteractions.push(savedFavoriteInteraction);
      }
      // Each user does a search
      const searchInteraction = userInteractionRepository.create({
        userId: users[i].id,
        interactionType: InteractionType.SEARCH,
        metadata: {
          searchQuery: "sedan",
          priceRange: { min: 20000, max: 40000 },
          location: "Colombo",
          filters: { color: "Silver" },
        },
      });
      const savedSearchInteraction = await userInteractionRepository.save(
        searchInteraction
      );
      createdUserInteractions.push(savedSearchInteraction);
    }

    logger.info("User interactions seeding completed successfully", {
      interactionCount: createdUserInteractions.length,
    });

    return createdUserInteractions;
  } catch (error) {
    logger.error("Error seeding user interactions", { error });
    throw error;
  }
}

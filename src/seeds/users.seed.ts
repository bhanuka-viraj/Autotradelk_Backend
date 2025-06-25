import { AppDataSource } from "../config/database.config";
import { User } from "../entities/User";
import * as bcrypt from "bcrypt";
import { createServiceLogger } from "../utils/logger.util";

const logger = createServiceLogger("UsersSeed");

const users = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "password123",
    phone: "+1234567890",
    role: "user",
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    password: "password123",
    phone: "+1234567891",
    role: "user",
  },
  {
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    password: "password123",
    phone: "+1234567892",
    role: "user",
  },
  {
    name: "Alice Brown",
    email: "alice.brown@example.com",
    password: "password123",
    phone: "+1234567893",
    role: "user",
  },
  {
    name: "Charlie Wilson",
    email: "charlie.wilson@example.com",
    password: "password123",
    phone: "+1234567894",
    role: "user",
  },
  {
    name: "Diana Davis",
    email: "diana.davis@example.com",
    password: "password123",
    phone: "+1234567895",
    role: "user",
  },
  {
    name: "Edward Miller",
    email: "edward.miller@example.com",
    password: "password123",
    phone: "+1234567896",
    role: "user",
  },
  {
    name: "Fiona Garcia",
    email: "fiona.garcia@example.com",
    password: "password123",
    phone: "+1234567897",
    role: "user",
  },
  {
    name: "George Martinez",
    email: "george.martinez@example.com",
    password: "password123",
    phone: "+1234567898",
    role: "user",
  },
  {
    name: "Helen Anderson",
    email: "helen.anderson@example.com",
    password: "password123",
    phone: "+1234567899",
    role: "user",
  },
];

export async function seedUsers(): Promise<User[]> {
  try {
    logger.info("Starting users seeding...");

    const userRepository = AppDataSource.getRepository(User);

    // Create users with hashed passwords
    const createdUsers = [];
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = userRepository.create({
        ...userData,
        password: hashedPassword,
      });
      const savedUser = await userRepository.save(user);
      createdUsers.push(savedUser);
      logger.info(`Created user: ${savedUser.name} (${savedUser.email})`);
    }

    logger.info("Users seeding completed successfully", {
      userCount: createdUsers.length,
    });

    return createdUsers;
  } catch (error) {
    logger.error("Error seeding users", { error });
    throw error;
  }
}

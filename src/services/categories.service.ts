import { Repository } from "typeorm";
import { AppDataSource } from "../config/database.config";
import { Category } from "../entities/Category";

export class CategoriesService {
  private categoryRepository: Repository<Category>;

  constructor() {
    this.categoryRepository = AppDataSource.getRepository(Category);
  }

  async getAll(): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: { isActive: true },
      order: { sortOrder: "ASC", name: "ASC" },
      relations: ["children"],
    });
  }

  async getRootCategories(): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: { level: 0, isActive: true },
      order: { sortOrder: "ASC", name: "ASC" },
      relations: ["children"],
    });
  }

  async getById(id: number): Promise<Category | null> {
    return await this.categoryRepository.findOne({
      where: { id, isActive: true },
      relations: ["children", "parent"],
    });
  }

  async getByLevel(level: number): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: { level, isActive: true },
      order: { sortOrder: "ASC", name: "ASC" },
    });
  }

  async create(categoryData: Partial<Category>): Promise<Category> {
    // Set level based on parent
    if (categoryData.parentId) {
      const parent = await this.categoryRepository.findOne({
        where: { id: categoryData.parentId },
      });
      if (parent) {
        categoryData.level = parent.level + 1;
      }
    } else {
      categoryData.level = 0;
    }

    const category = this.categoryRepository.create(categoryData);
    return await this.categoryRepository.save(category);
  }

  async update(
    id: number,
    categoryData: Partial<Category>
  ): Promise<Category | null> {
    await this.categoryRepository.update(id, categoryData);
    return await this.getById(id);
  }

  async delete(id: number): Promise<boolean> {
    // Check if category has children
    const children = await this.categoryRepository.find({
      where: { parentId: id, isActive: true },
    });

    if (children.length > 0) {
      throw new Error("Cannot delete category with subcategories");
    }

    const result = await this.categoryRepository.update(id, {
      isActive: false,
    });
    return result.affected !== 0;
  }

  async getCategoryTree(): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: { level: 0, isActive: true },
      order: { sortOrder: "ASC", name: "ASC" },
      relations: ["children", "children.children"],
    });
  }

  async getPopularCategories(limit: number = 10): Promise<Category[]> {
    return await this.categoryRepository
      .createQueryBuilder("category")
      .leftJoin("category.vehicles", "vehicle")
      .select("category")
      .addSelect("COUNT(vehicle.id)", "vehicleCount")
      .where("category.isActive = :isActive", { isActive: true })
      .groupBy("category.id")
      .orderBy("vehicleCount", "DESC")
      .limit(limit)
      .getMany();
  }
}

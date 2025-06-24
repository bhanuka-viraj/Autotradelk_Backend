import { Repository } from "typeorm";
import { AppDataSource } from "../config/database.config";
import { Brand } from "../entities/Brand";

export class BrandsService {
  private brandRepository: Repository<Brand>;

  constructor() {
    this.brandRepository = AppDataSource.getRepository(Brand);
  }

  async getAll(): Promise<Brand[]> {
    return await this.brandRepository.find({
      where: { isActive: true },
      order: { name: "ASC" },
    });
  }

  async getById(id: number): Promise<Brand | null> {
    return await this.brandRepository.findOne({
      where: { id, isActive: true },
      relations: ["vehicles"],
    });
  }

  async create(brandData: Partial<Brand>): Promise<Brand> {
    const brand = this.brandRepository.create(brandData);
    return await this.brandRepository.save(brand);
  }

  async update(id: number, brandData: Partial<Brand>): Promise<Brand | null> {
    await this.brandRepository.update(id, brandData);
    return await this.getById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.brandRepository.update(id, { isActive: false });
    return result.affected !== 0;
  }

  async getPopularBrands(limit: number = 10): Promise<Brand[]> {
    return await this.brandRepository
      .createQueryBuilder("brand")
      .leftJoin("brand.vehicles", "vehicle")
      .select("brand")
      .addSelect("COUNT(vehicle.id)", "vehicleCount")
      .where("brand.isActive = :isActive", { isActive: true })
      .groupBy("brand.id")
      .orderBy("vehicleCount", "DESC")
      .limit(limit)
      .getMany();
  }
}

import { In } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Vehicle } from '../entities/vehicle';

interface FindAllQuery {
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  location?: string;
  page?: number;
  limit?: number;
}

interface FindAllResponse {
  data: Vehicle[];
  meta: { total: number; page: number; limit: number };
}

export class VehiclesService {
  async findAll({
    brand,
    priceMin,
    priceMax,
    location,
    page = 1,
    limit = 10,
  }: FindAllQuery): Promise<FindAllResponse> {
    const vehicleRepository = AppDataSource.getRepository(Vehicle);
    const query = vehicleRepository
      .createQueryBuilder('vehicle')
      .where('vehicle.status = :status', { status: 'available' })
      .skip((page - 1) * limit)
      .take(limit);

    if (brand) query.andWhere('vehicle.brand = :brand', { brand });
    if (priceMin) query.andWhere('vehicle.price >= :priceMin', { priceMin });
    if (priceMax) query.andWhere('vehicle.price <= :priceMax', { priceMax });
    if (location) query.andWhere('vehicle.location = :location', { location });

    const [vehicles, total] = await query.getManyAndCount();
    return { data: vehicles, meta: { total, page, limit } };
  }

  async findOne(id: number): Promise<Vehicle> {
    const vehicleRepository = AppDataSource.getRepository(Vehicle);
    const vehicle = await vehicleRepository.findOne({ where: { id }, relations: ['user'] });
    if (!vehicle) throw new Error('Vehicle not found');
    return vehicle;
  }

  async getVehicleSuggestions(id: number, limit: number = 4): Promise<Vehicle[]> {
    const vehicleRepository = AppDataSource.getRepository(Vehicle);
    const vehicle = await vehicleRepository.findOne({ where: { id } });
    if (!vehicle) throw new Error('Vehicle not found');

    const priceRange = {
      min: vehicle.price * 0.9,
      max: vehicle.price * 1.1,
    };

    return vehicleRepository
      .createQueryBuilder('vehicle')
      .where('vehicle.id != :id', { id })
      .andWhere('vehicle.status = :status', { status: 'available' })
      .andWhere('vehicle.price BETWEEN :min AND :max', { min: priceRange.min, max: priceRange.max })
      .andWhere('vehicle.brand = :brand OR vehicle.model = :model', { brand: vehicle.brand, model: vehicle.model })
      .orderBy('vehicle.createdAt', 'DESC')
      .take(limit)
      .getMany();
  }

  async compareVehicles(ids: number[]): Promise<Vehicle[]> {
    const vehicleRepository = AppDataSource.getRepository(Vehicle);
    const vehicles = await vehicleRepository.findBy({ id: In(ids) });
    if (vehicles.length !== ids.length) throw new Error('One or more vehicles not found');
    return vehicles;
  }
}
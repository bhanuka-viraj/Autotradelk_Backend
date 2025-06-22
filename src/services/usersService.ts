import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { Vehicle } from '../entities/Vehicle';
import { Bid } from '../entities/Bid';

export class UsersService {
  async getUser(id: number, requestingUserId: number): Promise<User> {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id } });
    if (!user) throw new Error('User not found');
    if (id !== requestingUserId) throw new Error('Unauthorized access');
    return user;
  }

  async getUserVehicles(id: number): Promise<Vehicle[]> {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id }, relations: ['vehicles'] });
    if (!user) throw new Error('User not found');
    return user.vehicles;
  }

  async getUserBids(id: number): Promise<Bid[]> {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id }, relations: ['bids', 'bids.auction', 'bids.auction.vehicle'] });
    if (!user) throw new Error('User not found');
    return user.bids;
  }
}
import { AppDataSource } from '../config/database';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from '../entities/User';

interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  async signup(data: SignupData): Promise<{ id: number; name: string; email: string }> {
    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOne({ where: { email: data.email } });
    if (existingUser) throw new Error('Email already exists');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
      address: data.address,
      role: 'user',
    });

    await userRepository.save(user);
    return { id: user.id, name: user.name, email: user.email };
  }

  async login(data: LoginData): Promise<{ accessToken: string; user: { id: number; name: string; email: string } }> {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email: data.email } });
    if (!user) throw new Error('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) throw new Error('Invalid credentials');

    const accessToken = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    return {
      accessToken,
      user: { id: user.id, name: user.name, email: user.email },
    };
  }
}
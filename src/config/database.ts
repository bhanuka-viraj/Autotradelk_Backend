import { DataSource } from 'typeorm';
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/entities/*.ts'],
  synchronize: true, // Auto-create tables (use false in production)
  logging: false,
});

export const connectDB = async (): Promise<DataSource> => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('Database connected');
    }
    return AppDataSource;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};
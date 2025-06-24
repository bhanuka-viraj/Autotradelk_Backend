import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Vehicle } from "./Vehicle";
import { Category } from "./Category";

@Entity()
export class VehicleCategory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  vehicleId!: number;

  @Column()
  categoryId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.vehicleCategories)
  vehicle!: Vehicle;

  @ManyToOne(() => Category, (category) => category.vehicleCategories)
  category!: Category;
}

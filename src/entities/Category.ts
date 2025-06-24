import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { VehicleCategory } from "./VehicleCategory";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ nullable: true })
  icon!: string;

  @Column({ default: 0 })
  sortOrder!: number;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ nullable: true })
  parentId!: number;

  @Column({ default: 0 })
  level!: number; // 0 = root, 1 = subcategory, etc.

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Category, (category) => category.children)
  parent!: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children!: Category[];

  @OneToMany(
    () => VehicleCategory,
    (vehicleCategory) => vehicleCategory.category
  )
  vehicleCategories!: VehicleCategory[];
}

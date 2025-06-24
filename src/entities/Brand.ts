import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Vehicle } from "./Vehicle";

@Entity()
export class Brand {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({ nullable: true })
  displayName!: string;

  @Column({ nullable: true })
  logoUrl!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ nullable: true })
  website!: string;

  @Column({ nullable: true })
  countryOfOrigin!: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ nullable: true })
  parentBrandId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.brand)
  vehicles!: Vehicle[];
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Auction } from "./Auction";
import { Brand } from "./Brand";
import { Category } from "./Category";
import { Location } from "./Location";

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  model!: string;

  @Column()
  year!: number;

  @Column()
  mileage!: number;

  @Column()
  color!: string;

  @Column()
  condition!: string;

  @Column("decimal")
  price!: number;

  @Column({ type: "int" })
  locationId!: number;

  @ManyToOne(() => Location, (location) => location.vehicles)
  location!: Location;

  @Column()
  status!: string;

  // Enhanced specifications
  @Column({ nullable: true })
  engineSize!: string;

  @Column({ nullable: true })
  fuelType!: string;

  @Column({ nullable: true })
  transmission!: string;

  @Column({ nullable: true })
  bodyStyle!: string;

  @Column({ nullable: true })
  doors!: number;

  @Column({ nullable: true })
  seats!: number;

  @Column({ nullable: true })
  vin!: string;

  @Column({ nullable: true })
  registrationNumber!: string;

  @Column("json", { nullable: true })
  aftermarketParts!: string[] | null;

  @Column("json", { nullable: true })
  missingParts!: string[] | null;

  @Column("simple-array")
  images!: string[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.vehicles)
  user!: User;

  @ManyToOne(() => Brand, (brand) => brand.vehicles)
  brand!: Brand;

  @ManyToOne(() => Category, (category) => category.vehicles)
  category!: Category;

  @OneToMany(() => Auction, (auction) => auction.vehicle)
  auctions!: Auction[];
}

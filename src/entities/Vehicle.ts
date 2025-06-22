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

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  brand!: string;

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

  @Column()
  location!: string;

  @Column()
  status!: string;

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

  @OneToMany(() => Auction, (auction) => auction.vehicle)
  auctions!: Auction[];
}

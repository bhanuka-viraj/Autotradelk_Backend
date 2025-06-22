import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Vehicle } from "./Vehicle";
import { Auction } from "./Auction";
import { Bid } from "./Bid";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column({ nullable: true })
  address!: string;

  @Column({ default: "user" })
  role!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.user)
  vehicles!: Vehicle[];

  @OneToMany(() => Auction, (auction) => auction.user)
  auctions!: Auction[];

  @OneToMany(() => Bid, (bid) => bid.user)
  bids!: Bid[];
}

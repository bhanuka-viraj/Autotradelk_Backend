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
import { Vehicle } from "./Vehicle";
import { Bid } from "./Bid";

@Entity()
export class Auction {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.auctions)
  vehicle!: Vehicle;

  @ManyToOne(() => User, (user) => user.auctions)
  user!: User;

  @Column("decimal")
  startPrice!: number;

  @Column("decimal", { nullable: true })
  currentHighestBid!: number | null;

  @Column()
  deadline!: Date;

  @Column()
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Bid, (bid) => bid.auction)
  bids!: Bid[];
}

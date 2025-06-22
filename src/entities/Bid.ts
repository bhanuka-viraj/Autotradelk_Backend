import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Auction } from "./Auction";
import { User } from "./User";

@Entity()
export class Bid {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Auction, (auction) => auction.bids)
  auction!: Auction;

  @ManyToOne(() => User, (user) => user.bids)
  user!: User;

  @Column("decimal")
  amount!: number;

  @CreateDateColumn()
  createdAt!: Date;
}

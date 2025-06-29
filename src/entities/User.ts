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
import { UserInteraction } from "./UserInteraction";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  password!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column({ nullable: true })
  address!: string;

  @Column({ default: "user" })
  role!: string;

  @Column({ nullable: true, unique: true })
  googleId!: string;

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

  @OneToMany(() => UserInteraction, (interaction) => interaction.user)
  interactions!: UserInteraction[];
}

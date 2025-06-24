import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Index,
} from "typeorm";
import { User } from "./User";
import { Vehicle } from "./Vehicle";

export enum InteractionType {
  VIEW = "view",
  SEARCH = "search",
  BID = "bid",
  FAVORITE = "favorite",
  COMPARE = "compare",
}

@Entity()
@Index(["userId", "interactionType", "createdAt"])
@Index(["vehicleId", "interactionType", "createdAt"])
export class UserInteraction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column({ nullable: true })
  vehicleId!: number;

  @Column({
    type: "enum",
    enum: InteractionType,
  })
  interactionType!: InteractionType;

  @Column({ type: "jsonb", nullable: true })
  metadata!: {
    searchQuery?: string;
    priceRange?: { min: number; max: number };
    location?: string;
    filters?: Record<string, any>;
    duration?: number; // Time spent viewing
  };

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.interactions)
  user!: User;

  @ManyToOne(() => Vehicle, { nullable: true })
  vehicle!: Vehicle;
}

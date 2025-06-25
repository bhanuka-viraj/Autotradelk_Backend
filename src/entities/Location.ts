import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { Vehicle } from "./Vehicle";
import { Auction } from "./Auction";

export enum LocationType {
  PROVINCE = "province",
  DISTRICT = "district",
  CITY = "city",
  AREA = "area",
}

@Entity("locations")
@Index(["name", "type"])
@Index(["parentId", "type"])
export class Location {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  nameSinhala?: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  nameTamil?: string;

  @Column({
    type: "enum",
    enum: LocationType,
    default: LocationType.AREA,
  })
  type!: LocationType;

  @Column({ type: "varchar", length: 10, nullable: true })
  code?: string; // Postal code or administrative code

  @Column({ type: "decimal", precision: 10, scale: 8, nullable: true })
  latitude?: number;

  @Column({ type: "decimal", precision: 11, scale: 8, nullable: true })
  longitude?: number;

  @Column({ type: "int", nullable: true })
  parentId?: number;

  @ManyToOne(() => Location, { nullable: true })
  @JoinColumn({ name: "parentId" })
  parent?: Location;

  @OneToMany(() => Location, (location) => location.parent)
  children?: Location[];

  @OneToMany(() => Vehicle, (vehicle) => vehicle.location)
  vehicles?: Vehicle[];

  @OneToMany(() => Auction, (auction) => auction.location)
  auctions?: Auction[];

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @Column({ type: "int", default: 0 })
  sortOrder!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

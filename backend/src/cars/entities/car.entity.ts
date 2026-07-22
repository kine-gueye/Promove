import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CarCategory } from '../enums/car-category.enum';
import { Transmission, FuelType } from '../enums/transmission.enum';
import { Booking } from '../../bookings/entities/booking.entity';
import { Review } from '../../reviews/entities/review.entity';

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  brand!: string; // Ferrari, Lamborghini, Rolls-Royce...

  @Column()
  model!: string; // 488 GTB, Urus, Phantom...

  @Column()
  year!: number;

  @Column({
    type: 'enum',
    enum: CarCategory,
    default: CarCategory.BERLINE,
  })
  category!: CarCategory;

  @Column({
    type: 'enum',
    enum: Transmission,
    default: Transmission.AUTOMATIQUE,
  })
  transmission!: Transmission;

  @Column({
    type: 'enum',
    enum: FuelType,
    default: FuelType.ESSENCE,
  })
  fuelType!: FuelType;

  @Column()
  seats!: number;

  @Column({ name: 'price_per_day', type: 'decimal', precision: 10, scale: 2 })
  pricePerDay!: number;

  @Column({ default: 'XOF' })
  currency!: string; // devise de base des prix stockes en base

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl!: string;

  @Column({ default: true })
  available!: boolean;

  @Column({ name: 'mileage_limit_km', nullable: true })
  mileageLimitKm!: number; // kilometrage max autorise par jour de location

  @OneToMany(() => Booking, (booking) => booking.car)
  bookings!: Booking[];

  @OneToMany(() => Review, (review) => review.car)
  reviews!: Review[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

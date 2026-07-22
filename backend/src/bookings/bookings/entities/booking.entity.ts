import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Car } from '../../cars/entities/car.entity';
import { BookingStatus } from '../enums/booking-status.enum';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'user_id' })
  userId!: string;

  @ManyToOne(() => Car, (car) => car.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'car_id' })
  car!: Car;

  @Column({ name: 'car_id' })
  carId!: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate!: string; // date de prise en charge

  @Column({ name: 'end_date', type: 'date' })
  endDate!: string; // date de retour

  @Column({ name: 'pickup_location' })
  pickupLocation!: string; // ex: "Nice Cote d'Azur"

  @Column({ name: 'return_location', nullable: true })
  returnLocation!: string; // si different du lieu de prise en charge

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status!: BookingStatus;

  @Column({ name: 'total_price', type: 'decimal', precision: 12, scale: 2 })
  totalPrice!: number; // = pricePerDay * nombre de jours, calcule cote serveur

  @Column({ default: 'XOF' })
  currency!: string;

  @Column({ type: 'text', nullable: true })
  notes!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

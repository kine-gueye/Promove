import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Car } from '../../cars/entities/car.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'user_id' })
  userId!: string;

  @ManyToOne(() => Car, (car) => car.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'car_id' })
  car!: Car;

  @Column({ name: 'car_id' })
  carId!: string;

  @Column({ type: 'int' })
  rating!: number; // note de 1 a 5

  @Column({ type: 'text', nullable: true })
  comment!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}

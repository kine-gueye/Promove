import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Emplacement de parking physique (ex: 24 places, zones Plateau/VDN...).
 * Alimente la page "Plan Interactif" du dashboard admin PROMOVE.
 */
@Entity('parking_spots')
export class ParkingSpot {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'spot_number' })
  spotNumber!: number; // numero affiche sur la grille (#1, #2, ...)

  @Column({ default: 'Plateau' })
  zone!: string; // ex: "Plateau", "VDN"

  @Column({ name: 'is_occupied', default: false })
  isOccupied!: boolean;

  @Column({ name: 'car_plate', type: 'varchar', nullable: true })
  carPlate!: string | null;

  @Column({ name: 'owner_name', type: 'varchar', nullable: true })
  ownerName!: string | null;

  @Column({ name: 'vehicle_model', type: 'varchar', nullable: true })
  vehicleModel!: string | null;

  @Column({ name: 'occupied_at', type: 'timestamp', nullable: true })
  occupiedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

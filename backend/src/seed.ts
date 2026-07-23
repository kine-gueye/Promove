import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AppModule } from './app.module';
import { User } from './users/entities/user.entity';
import { Car } from './cars/entities/car.entity';
import { ParkingSpot } from './parking/entities/parking-spot.entity';
import { Role } from './users/enums/role.enum';
import { CarCategory } from './cars/enums/car-category.enum';
import { Transmission, FuelType } from './cars/enums/transmission.enum';

/**
 * Script de seed : cree un compte admin, un compte manager et le
 * catalogue de vehicules PROMOVE (Dakar), + les emplacements de parking.
 * Usage : npm run seed
 */
async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userRepository = app.get(getRepositoryToken(User));
  const carRepository = app.get(getRepositoryToken(Car));
  const parkingRepository = app.get(getRepositoryToken(ParkingSpot));

  // --- Comptes de demo ---
  const accounts = [
    { email: 'admin@promove.sn', password: 'Admin123!', firstName: 'Admin', lastName: 'PROMOVE', role: Role.ADMIN },
    { email: 'manager@promove.sn', password: 'Manager123!', firstName: 'Manager', lastName: 'PROMOVE', role: Role.MANAGER },
  ];
  for (const acc of accounts) {
    const existing = await userRepository.findOne({ where: { email: acc.email } });
    if (!existing) {
      const hashedPassword = await bcrypt.hash(acc.password, 10);
      await userRepository.save(
        userRepository.create({ ...acc, password: hashedPassword }),
      );
      // eslint-disable-next-line no-console
      console.log(`Compte cree : ${acc.email} / ${acc.password} (${acc.role})`);
    }
  }

  // --- Catalogue PROMOVE (aligne sur les 24 vehicules du frontend) ---
  const existingCars = await carRepository.count();
  if (existingCars === 0) {
    const T = Transmission.AUTOMATIQUE;
    const E = FuelType.ESSENCE;
    const D = FuelType.DIESEL;
    const demoCars: Partial<Car>[] = [
      { brand: 'Toyota', model: 'Prado', year: 2022, category: CarCategory.SUV, seats: 7, pricePerDay: 50000, fuelType: D },
      { brand: 'Mercedes', model: 'Classe C', year: 2021, category: CarCategory.LUXE, seats: 5, pricePerDay: 75000, fuelType: E },
      { brand: 'Hyundai', model: 'Accent', year: 2020, category: CarCategory.ECONOMIQUE, seats: 5, pricePerDay: 30000, fuelType: E },
      { brand: 'Toyota', model: 'Fortuner', year: 2022, category: CarCategory.SUV, seats: 7, pricePerDay: 55000, fuelType: D },
      { brand: 'Mitsubishi', model: 'L200', year: 2021, category: CarCategory.PICKUP, seats: 5, pricePerDay: 45000, fuelType: D },
      { brand: 'Ford', model: 'Explorer', year: 2021, category: CarCategory.SUV, seats: 7, pricePerDay: 60000, fuelType: E },
      { brand: 'Range Rover', model: 'Velar', year: 2023, category: CarCategory.LUXE, seats: 5, pricePerDay: 120000, fuelType: E },
      { brand: 'Hyundai', model: 'Santa Fe', year: 2021, category: CarCategory.SUV, seats: 7, pricePerDay: 45000, fuelType: D },
      { brand: 'Kia', model: 'Sportage', year: 2021, category: CarCategory.SUV, seats: 5, pricePerDay: 40000, fuelType: E },
      { brand: 'Toyota', model: 'Hilux', year: 2022, category: CarCategory.PICKUP, seats: 5, pricePerDay: 50000, fuelType: D },
      { brand: 'BMW', model: 'Série 5', year: 2022, category: CarCategory.LUXE, seats: 5, pricePerDay: 90000, fuelType: E },
      { brand: 'Audi', model: 'A6', year: 2021, category: CarCategory.LUXE, seats: 5, pricePerDay: 85000, fuelType: E },
      { brand: 'Toyota', model: 'Camry', year: 2021, category: CarCategory.BERLINE, seats: 5, pricePerDay: 45000, fuelType: E },
      { brand: 'Honda', model: 'Accord', year: 2020, category: CarCategory.BERLINE, seats: 5, pricePerDay: 40000, fuelType: E },
      { brand: 'Volkswagen', model: 'Passat', year: 2020, category: CarCategory.BERLINE, seats: 5, pricePerDay: 40000, fuelType: E },
      { brand: 'Kia', model: 'Picanto', year: 2020, category: CarCategory.ECONOMIQUE, seats: 5, pricePerDay: 20000, fuelType: E },
      { brand: 'Suzuki', model: 'Swift', year: 2020, category: CarCategory.ECONOMIQUE, seats: 5, pricePerDay: 22000, fuelType: E },
      { brand: 'Toyota', model: 'Yaris', year: 2021, category: CarCategory.ECONOMIQUE, seats: 5, pricePerDay: 25000, fuelType: E },
      { brand: 'Hyundai', model: 'i10', year: 2020, category: CarCategory.ECONOMIQUE, seats: 5, pricePerDay: 20000, fuelType: E },
      { brand: 'Renault', model: 'Logan', year: 2020, category: CarCategory.ECONOMIQUE, seats: 5, pricePerDay: 25000, fuelType: E },
      { brand: 'Toyota', model: 'Hiace', year: 2021, category: CarCategory.TRANSPORT, seats: 15, pricePerDay: 65000, fuelType: D },
      { brand: 'Mercedes', model: 'Sprinter', year: 2021, category: CarCategory.TRANSPORT, seats: 18, pricePerDay: 95000, fuelType: D },
      { brand: 'Hyundai', model: 'H1', year: 2020, category: CarCategory.TRANSPORT, seats: 9, pricePerDay: 60000, fuelType: D },
      { brand: 'Lexus', model: 'LX600', year: 2023, category: CarCategory.LUXE, seats: 7, pricePerDay: 100000, fuelType: E },
    ];

    for (const carData of demoCars) {
      await carRepository.save(
        carRepository.create({
          ...carData,
          transmission: T,
          currency: 'XOF',
          available: true,
          mileageLimitKm: 250,
        }),
      );
    }
    // eslint-disable-next-line no-console
    console.log(`${demoCars.length} véhicules PROMOVE créés.`);
  }

  // --- Emplacements de parking (12 Plateau + 12 VDN, comme le dashboard) ---
  const existingSpots = await parkingRepository.count();
  if (existingSpots === 0) {
    const spots: Partial<ParkingSpot>[] = [];
    for (let i = 1; i <= 12; i++) spots.push({ spotNumber: i, zone: 'Plateau' });
    for (let i = 13; i <= 24; i++) spots.push({ spotNumber: i, zone: 'VDN' });

    for (const spotData of spots) {
      await parkingRepository.save(parkingRepository.create(spotData));
    }
    // eslint-disable-next-line no-console
    console.log(`${spots.length} emplacements de parking créés.`);
  }

  await app.close();
}

seed().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Erreur lors du seed :', error);
  process.exit(1);
});

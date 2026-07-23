import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CarsModule } from './cars/cars.module';
import { BookingsModule } from './bookings/bookings.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CurrencyModule } from './currency/currency.module';
import { WeatherModule } from './weather/weather.module';
import { ParkingModule } from './parking/parking.module';
import { MonitoringModule } from './monitoring/monitoring.module';

import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

import { User } from './users/entities/user.entity';
import { Car } from './cars/entities/car.entity';
import { Booking } from './bookings/entities/booking.entity';
import { Review } from './reviews/entities/review.entity';
import { ParkingSpot } from './parking/entities/parking-spot.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20,
      },
    ]),

    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<any> => {
        try {
          const store = await redisStore({
            socket: {
              host: configService.get<string>('REDIS_HOST', 'localhost'),
              port: configService.get<number>('REDIS_PORT', 6379),
            },
            ttl: 600 * 1000,
          });
          return { store, ttl: 600 * 1000 };
        } catch {
          return { ttl: 600 * 1000 };
        }
      },
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Car, Booking, Review, ParkingSpot],
        synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'true',
        logging: false,
      }),
    }),

    AuthModule,
    UsersModule,
    CarsModule,
    BookingsModule,
    ReviewsModule,
    CurrencyModule,
    WeatherModule,
    ParkingModule,
    MonitoringModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}

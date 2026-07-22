import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import { CarCategory } from '../enums/car-category.enum';
import { Transmission, FuelType } from '../enums/transmission.enum';

export class CreateCarDto {
  @ApiProperty({ example: 'Ferrari' })
  @IsString()
  brand: string;

  @ApiProperty({ example: '488 GTB' })
  @IsString()
  model: string;

  @ApiProperty({ example: 2023 })
  @IsInt()
  @Min(1990)
  @Max(2027)
  year: number;

  @ApiProperty({ enum: CarCategory, example: CarCategory.SUV })
  @IsEnum(CarCategory)
  category: CarCategory;

  @ApiProperty({ enum: Transmission, example: Transmission.AUTOMATIQUE })
  @IsOptional()
  @IsEnum(Transmission)
  transmission?: Transmission;

  @ApiProperty({ enum: FuelType, example: FuelType.ESSENCE })
  @IsOptional()
  @IsEnum(FuelType)
  fuelType?: FuelType;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  @Max(9)
  seats: number;

  @ApiProperty({ example: 350000 })
  @IsNumber()
  @IsPositive()
  pricePerDay: number;

  @ApiProperty({ example: 'XOF', required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl({}, { message: "L'URL de l'image n'est pas valide" })
  imageUrl?: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @ApiProperty({ required: false, example: 250 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  mileageLimitKm?: number;
}

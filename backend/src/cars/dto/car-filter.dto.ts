import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { CarCategory } from '../enums/car-category.enum';

/**
 * DTO utilise pour les query params de recherche/filtrage du catalogue :
 * GET /cars?category=suv&brand=Toyota&minPrice=20000&maxPrice=80000
 */
export class CarFilterDto {
  @ApiProperty({ enum: CarCategory, required: false })
  @IsOptional()
  @IsEnum(CarCategory)
  category?: CarCategory;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;
}

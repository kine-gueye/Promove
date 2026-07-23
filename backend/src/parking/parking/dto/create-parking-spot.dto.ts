import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsPositive } from 'class-validator';

export class CreateParkingSpotDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  spotNumber: number;

  @ApiProperty({ example: 'Plateau', required: false })
  @IsOptional()
  @IsString()
  zone?: string;
}

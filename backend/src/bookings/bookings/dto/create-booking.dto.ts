import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 'b3f1a2c4-...-uuid-de-la-voiture' })
  @IsUUID()
  carId: string;

  @ApiProperty({ example: '2026-08-10' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-08-15' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: "Nice Cote d'Azur" })
  @IsString()
  pickupLocation: string;

  @ApiProperty({ example: "Nice Cote d'Azur", required: false })
  @IsOptional()
  @IsString()
  returnLocation?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

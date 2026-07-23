import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class OccupySpotDto {
  @ApiProperty({ example: 'DK-1234-AB' })
  @IsString()
  carPlate: string;

  @ApiProperty({ example: 'Youssouf Bah' })
  @IsString()
  ownerName: string;

  @ApiProperty({ example: 'Toyota Corolla', required: false })
  @IsOptional()
  @IsString()
  vehicleModel?: string;
}

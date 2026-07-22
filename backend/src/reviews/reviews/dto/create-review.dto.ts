import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 'uuid-de-la-voiture' })
  @IsUUID()
  carId: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ required: false, example: 'Experience exceptionnelle, vehicule impeccable.' })
  @IsOptional()
  @IsString()
  comment?: string;
}

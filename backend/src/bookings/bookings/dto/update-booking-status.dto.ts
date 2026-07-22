import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { BookingStatus } from '../enums/booking-status.enum';

// DTO dedie utilise par le manager/admin pour faire evoluer le statut
// d'une reservation (valider, activer, terminer, annuler).
export class UpdateBookingStatusDto {
  @ApiProperty({ enum: BookingStatus, example: BookingStatus.CONFIRMED })
  @IsEnum(BookingStatus)
  status: BookingStatus;
}

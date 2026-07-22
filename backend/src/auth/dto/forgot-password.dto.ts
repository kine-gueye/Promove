import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'client@luxrent.com' })
  @IsEmail({}, { message: 'Adresse email invalide' })
  email: string;
}

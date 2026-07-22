import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '../enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'client@luxrent.com' })
  @IsEmail({}, { message: 'Adresse email invalide' })
  email: string;

  @ApiProperty({ example: 'MotDePasse123!' })
  @IsString()
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caracteres',
  })
  password: string;

  @ApiProperty({ example: 'Awa' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Diop' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '+221771234567', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ enum: Role, required: false, default: Role.CLIENT })
  @IsOptional()
  @IsEnum(Role, { message: 'Role invalide' })
  role?: Role;
}

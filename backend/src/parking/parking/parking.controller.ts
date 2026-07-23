import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParkingService } from './parking.service';
import { CreateParkingSpotDto } from './dto/create-parking-spot.dto';
import { OccupySpotDto } from './dto/occupy-spot.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';

/**
 * Gestion des emplacements de parking (page "Plan Interactif" du dashboard).
 * Reservee au staff (ADMIN/MANAGER) : c'est un outil operationnel interne,
 * pas une fonctionnalite cote client.
 */
@ApiTags('parking')
@ApiBearerAuth('access-token')
@Roles(Role.ADMIN, Role.MANAGER)
@Controller('parking')
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un emplacement de parking' })
  create(@Body() dto: CreateParkingSpotDto) {
    return this.parkingService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister tous les emplacements' })
  findAll() {
    return this.parkingService.findAll();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Statistiques occupation (libres/occupées)' })
  getStats() {
    return this.parkingService.getStats();
  }

  @Patch(':id/occupy')
  @ApiOperation({ summary: 'Enregistrer un véhicule sur un emplacement' })
  occupy(@Param('id', ParseUUIDPipe) id: string, @Body() dto: OccupySpotDto) {
    return this.parkingService.occupy(id, dto);
  }

  @Patch(':id/release')
  @ApiOperation({ summary: 'Libérer un emplacement' })
  release(@Param('id', ParseUUIDPipe) id: string) {
    return this.parkingService.release(id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CarFilterDto } from './dto/car-filter.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';

@ApiTags('cars')
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Ajouter un vehicule au catalogue - ADMIN/MANAGER' })
  create(@Body() createCarDto: CreateCarDto) {
    return this.carsService.create(createCarDto);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Lister / rechercher les vehicules (public, avec filtres)',
  })
  findAll(@Query() filters: CarFilterDto) {
    return this.carsService.findAll(filters);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Detail d un vehicule (public)' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.carsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Modifier un vehicule - ADMIN/MANAGER' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCarDto: UpdateCarDto,
  ) {
    return this.carsService.update(id, updateCarDto);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Supprimer un vehicule du catalogue - ADMIN' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.carsService.remove(id);
  }
}

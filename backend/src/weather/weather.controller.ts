import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { WeatherService } from './weather.service';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('weather')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Meteo d une ville (widget "Destination Actuelle" du dashboard)',
  })
  @ApiQuery({ name: 'city', example: 'Monaco' })
  getWeather(@Query('city') city: string) {
    return this.weatherService.getWeatherByCity(city);
  }
}

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';

@Module({
  imports: [HttpModule.register({ timeout: 5000 })],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}

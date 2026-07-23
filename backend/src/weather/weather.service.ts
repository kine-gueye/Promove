import { BadGatewayException, Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

/**
 * Integration de l'API externe OpenWeather -> alimente le widget
 * "Destination Actuelle" du dashboard client (ville de prise en charge du vehicule).
 *
 * Mise en cache Redis (bonus) pendant 10 minutes : la meteo ne varie pas
 * assez vite pour justifier un appel externe a chaque chargement de page.
 */
@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  private readonly CACHE_TTL_MS = 10 * 60 * 1000;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getWeatherByCity(city: string) {
    const cacheKey = `weather:${city.toLowerCase()}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    const apiKey = this.configService.get<string>('OPENWEATHER_API_KEY');
    const url = 'https://api.openweathermap.org/data/2.5/weather';

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          params: { q: city, appid: apiKey, units: 'metric', lang: 'fr' },
        }),
      );

      const data = response.data;
      const result = {
        city: data.name,
        country: data.sys?.country,
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        description: data.weather?.[0]?.description,
        icon: data.weather?.[0]?.icon,
      };
      await this.cacheManager.set(cacheKey, result, this.CACHE_TTL_MS);
      return result;
    } catch (error) {
      this.logger.error(
        `Erreur lors de l'appel a OpenWeather API: ${error.message}`,
      );
      throw new BadGatewayException(
        `Impossible de recuperer la meteo pour ${city}`,
      );
    }
  }
}

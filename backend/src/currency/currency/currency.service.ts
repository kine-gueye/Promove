import { BadGatewayException, Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

/**
 * Integration de l'API externe ExchangeRate (https://www.exchangerate-api.com/)
 * -> alimente le widget "Taux de Change" du dashboard et permet de convertir
 *    le prix de location d'un vehicule dans la devise choisie par le client.
 *
 * Les taux sont mis en cache (Redis, bonus) pendant 10 minutes : ils ne
 * changent pas seconde par seconde, et ca evite de solliciter l'API externe
 * (souvent limitee en nombre d'appels gratuits) a chaque clic utilisateur.
 */
@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);
  private readonly CACHE_TTL_MS = 10 * 60 * 1000;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getRates(baseCurrency = 'EUR') {
    const cacheKey = `currency:rates:${baseCurrency}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    const apiKey = this.configService.get<string>('EXCHANGE_RATE_API_KEY');
    const baseUrl = this.configService.get<string>('EXCHANGE_RATE_BASE_URL');
    const url = `${baseUrl}/${apiKey}/latest/${baseCurrency}`;

    try {
      const response = await firstValueFrom(this.httpService.get(url));
      const result = {
        base: baseCurrency,
        rates: response.data.conversion_rates,
        lastUpdate: response.data.time_last_update_utc,
      };
      await this.cacheManager.set(cacheKey, result, this.CACHE_TTL_MS);
      return result;
    } catch (error) {
      this.logger.error(
        `Erreur lors de l'appel a ExchangeRate API: ${error.message}`,
      );
      throw new BadGatewayException(
        "Impossible de recuperer les taux de change pour le moment",
      );
    }
  }

  async convert(from: string, to: string, amount: number) {
    const { rates } = (await this.getRates(from)) as { rates: Record<string, number> };
    const rate = rates[to];

    if (!rate) {
      throw new BadGatewayException(`Devise ${to} non supportee`);
    }

    return {
      from,
      to,
      amount,
      rate,
      convertedAmount: Number((amount * rate).toFixed(2)),
    };
  }
}

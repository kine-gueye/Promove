import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrencyService } from './currency.service';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('currency')
@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Public()
  @Get('rates')
  @ApiOperation({ summary: 'Taux de change actuels (widget dashboard)' })
  @ApiQuery({ name: 'base', required: false, example: 'EUR' })
  getRates(@Query('base') base?: string) {
    return this.currencyService.getRates(base);
  }

  @Public()
  @Get('convert')
  @ApiOperation({
    summary: 'Convertir le prix de location d un vehicule dans une autre devise',
  })
  @ApiQuery({ name: 'from', example: 'XOF' })
  @ApiQuery({ name: 'to', example: 'EUR' })
  @ApiQuery({ name: 'amount', example: 350000 })
  convert(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('amount') amount: string,
  ) {
    return this.currencyService.convert(from, to, Number(amount));
  }
}

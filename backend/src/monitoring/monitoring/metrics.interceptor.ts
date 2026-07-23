import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MetricsService } from './metrics.service';

/**
 * Enregistre automatiquement, pour chaque requete HTTP, sa duree et son
 * compte dans les metriques Prometheus (methode, route, code de statut).
 */
@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const start = process.hrtime();

    const route = request.route?.path || request.url;
    const method = request.method;

    return next.handle().pipe(
      tap({
        next: () => this.record(method, route, response.statusCode, start),
        error: () => this.record(method, route, response.statusCode || 500, start),
      }),
    );
  }

  private record(method: string, route: string, statusCode: number, start: [number, number]) {
    const diff = process.hrtime(start);
    const durationInSeconds = diff[0] + diff[1] / 1e9;
    const labels = { method, route, status_code: String(statusCode) };

    this.metricsService.httpRequestsTotal.inc(labels);
    this.metricsService.httpRequestDuration.observe(labels, durationInSeconds);
  }
}

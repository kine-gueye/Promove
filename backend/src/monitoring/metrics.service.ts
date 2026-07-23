import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';

/**
 * Registre Prometheus de l'application (bonus "Monitoring avec Prometheus
 * et Grafana"). Expose des metriques par defaut (CPU, memoire, event loop)
 * ainsi que des metriques HTTP custom alimentees par MetricsInterceptor.
 */
@Injectable()
export class MetricsService {
  public readonly registry: client.Registry;
  public readonly httpRequestsTotal: client.Counter<string>;
  public readonly httpRequestDuration: client.Histogram<string>;

  constructor() {
    this.registry = new client.Registry();
    client.collectDefaultMetrics({ register: this.registry, prefix: 'promove_' });

    this.httpRequestsTotal = new client.Counter({
      name: 'promove_http_requests_total',
      help: 'Nombre total de requetes HTTP recues',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.registry],
    });

    this.httpRequestDuration = new client.Histogram({
      name: 'promove_http_request_duration_seconds',
      help: 'Duree des requetes HTTP en secondes',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
      registers: [this.registry],
    });
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}

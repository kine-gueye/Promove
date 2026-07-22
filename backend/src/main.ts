import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 3000;
  const apiPrefix = process.env.API_PREFIX || 'api/v1';

  // Securite HTTP de base
  app.use(helmet());

  // CORS pour permettre au frontend de consommer l'API
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  });

  // Prefixe global des routes -> /api/v1/... (sauf /metrics, scrape Prometheus standard)
  app.setGlobalPrefix(apiPrefix, { exclude: ['metrics'] });

  // Validation automatique des DTO (class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // supprime les proprietes non déclarées dans le DTO
      forbidNonWhitelisted: true, // renvoie une erreur si une propriete inconnue est envoyee
      transform: true, // transforme automatiquement les payloads vers les classes DTO
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Filtre global de gestion des erreurs -> reponses HTTP uniformes
  app.useGlobalFilters(new HttpExceptionFilter());

  // Interceptor global -> format de reponse uniforme { success, data, ... }
  app.useGlobalInterceptors(new TransformInterceptor());

  // Documentation Swagger (OpenAPI) accessible sur /api/docs
  const config = new DocumentBuilder()
    .setTitle('PROMOVE API')
    .setDescription(
      "API REST pour PROMOVE, plateforme de location de vehicules et de " +
        'gestion de parking a Dakar. ' +
        'Gestion des utilisateurs, des vehicules, des reservations, ' +
        "de l'authentification JWT et des roles (RBAC).",
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .addTag('auth', "Inscription, connexion, gestion du profil")
    .addTag('cars', 'Catalogue des véhicules')
    .addTag('bookings', 'Reservations des vehicules')
    .addTag('reviews', 'Avis clients sur les vehicules')
    .addTag('users', 'Gestion des utilisateurs (admin)')
    .addTag('currency', 'Conversion de devises (API externe)')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);

  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Application demarree sur : http://localhost:${port}/${apiPrefix}`);
  // eslint-disable-next-line no-console
  console.log(`Documentation Swagger : http://localhost:${port}/${apiPrefix}/docs`);
}
bootstrap();

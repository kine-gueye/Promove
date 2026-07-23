import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

/**
 * Test end-to-end de base : verifie que le catalogue de vehicules
 * (route publique) repond correctement et que les routes protegees
 * refusent l'acces sans token JWT.
 *
 * Necessite une base de donnees PostgreSQL accessible (voir .env).
 */
describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/cars (GET) - route publique, doit repondre 200', () => {
    return request(app.getHttpServer()).get('/api/v1/cars').expect(200);
  });

  it('/api/v1/bookings (GET) - route protegee, doit repondre 401 sans token', () => {
    return request(app.getHttpServer()).get('/api/v1/bookings').expect(401);
  });

  it('/api/v1/auth/register (POST) - doit rejeter un email invalide', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: 'pas-un-email',
        password: 'MotDePasse123!',
        firstName: 'Test',
        lastName: 'User',
      })
      .expect(400);
  });
});

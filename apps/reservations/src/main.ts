import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './reservations.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // App setup
  const app = await NestFactory.create(ReservationsModule);
  const configService = app.get(ConfigService);

  // Use cookies (JWT)
  app.use(cookieParser());

  // Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Pino logger
  app.useLogger(app.get(Logger));

  // Listen on specificed port
  await app.listen(configService.get('PORT'));
}
bootstrap();

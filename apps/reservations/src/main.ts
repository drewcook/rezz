import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './reservations.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);
  // Config
  const configService = app.get(ConfigService);
  // Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // Pino logger
  app.useLogger(app.get(Logger));
  // Listen on specificed port
  await app.listen(configService.get('PORT'));
}
bootstrap();

import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  // App setup
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);

  // Allow connections via TCP for microservices
  app.connectMicroservice({
    transport: Transport.TCP,
    // Bind to all public interfaces on our host to listen to incoming requests
    options: {
      host: '0.0.0.0',
      port: configService.get('TCP_PORT'),
    },
  });

  // Use cookies (JWT)
  app.use(cookieParser());

  // Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Pino logger
  app.useLogger(app.get(Logger));

  // Listen for incoming microservice connections
  await app.startAllMicroservices();

  // Listen for HTTP requests on specificed port
  await app.listen(configService.get('HTTP_PORT'));
}
bootstrap();

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { readFileSync } from 'fs';
import { parse } from 'yaml';
import { AppModule } from './app.module';
import { LoggingService } from './logger/logger.service';
import { getExceptionHandler } from './logger/exceptionHandler';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  const docFile = readFileSync('./doc/api.yaml', 'utf-8');

  SwaggerModule.setup('api', app, parse(docFile));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const logger = await app.resolve(LoggingService);

  app.useLogger(logger);
  getExceptionHandler(logger);

  await app.listen(process.env.PORT || 4000);

  logger.log(`Server is running on port: ${process.env.PORT}`);
};

bootstrap().catch((err) => {
  console.error(`An unexpected error occurred: ${err.message}`);

  process.exit(1);
});

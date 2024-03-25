import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { readFileSync } from 'fs';
import { parse } from 'yaml';
import { AppModule } from './app.module';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  const docFile = readFileSync('./doc/api.yaml', 'utf-8');

  SwaggerModule.setup('api', app, parse(docFile));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(process.env.PORT || 4000);
};

bootstrap();

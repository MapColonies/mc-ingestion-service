import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { MCLogger } from '@map-colonies/mc-logger';
import { Probe } from '@map-colonies/mc-probe';
import { AppModule } from './app.module';
import { ErrorHandler } from './Middleware/ErrorHandler';
import { NestLogger } from './Modules/logger/NestLogger';
import { ConfigService } from './Modules/configuration/ConfigService';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(MCLogger);
  const config = app.get(ConfigService);
  const probe = app.get(Probe);

  //CORS
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    app.enableCors();
  }

  //swagger configuration
  const options = new DocumentBuilder()
    .setTitle('Ingestion  Service')
    .setDescription('api for uploading rasters and metadata')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  //global middleware registration
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );
  app.useLogger(new NestLogger(logger));
  app.useGlobalFilters(app.get(ErrorHandler));

  //start server
  try {
    await probe.startNest(app, config.get('host.port'));
    probe.readyFlag = true;
  } catch {
    probe.liveFlag = false;
  }
}

bootstrap();

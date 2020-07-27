import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ErrorHandler } from './Middleware/ErrorHandler';
import { NestLogger } from './Modules/logger/NestLogger';
import { Logger } from './Modules/logger/Logger';
import { ConfigService } from './Modules/configuration/ConfigService';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  const logger = app.get(Logger);
  const config = app.get(ConfigService);
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
  await app.listen(config.get('host.port'));
}

bootstrap();

import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Gazeta.uz API')
    .setDescription('The News Portal API inspired by Gazeta.uz')
    .setVersion('1.0')
    .addTag('Posts')
    .addTag('Categories')
    .addTag('Tags')
    .addTag('Users')
    .addTag('Media')
    .addTag('Comments')
    .addTag('Reactions')
    .addTag('Post Translations')
    .addTag('Category Translations')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const swaggerPath = 'api/docs';
  SwaggerModule.setup(swaggerPath, app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  const logger = new (require('@nestjs/common').Logger)('Bootstrap');
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Swagger UI available at: http://localhost:${port}/${swaggerPath}`);
}
bootstrap();

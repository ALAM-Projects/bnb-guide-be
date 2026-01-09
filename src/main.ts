import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Bnb guide API')
    .setDescription('The Bnb guide API description')
    .setVersion('1.0')
    .build();

  const allowedTags = ['Posts', 'Users'];
  const document = SwaggerModule.createDocument(app, config);

  document.tags = document.tags?.filter(({ name }) =>
    allowedTags.includes(name),
  );
  Object.values(document.paths).forEach((pathItem: Record<string, unknown>) => {
    Object.values(pathItem).forEach((operation: Record<string, unknown>) => {
      const tags = operation?.['tags'] as string[] | undefined;
      if (tags) {
        operation['tags'] = tags.filter((tag) => allowedTags.includes(tag));
      }
    });
  });

  SwaggerModule.setup('api', app, document);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap().catch((error: Error) => {
  console.error(error);
  process.exit(1);
});

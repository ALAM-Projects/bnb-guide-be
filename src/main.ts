import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import * as fs from 'node:fs';

declare const module: {
  hot?: {
    accept: () => void;
    dispose: (callback: () => Promise<void>) => void;
  };
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Hostly')
    .setDescription('Hostly API description')
    .setVersion('1.0')
    .build();

  const allowedTags = ['Posts', 'Users'];
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  // Questo genera il file fisico che Orval leggerà
  if (process.env.NODE_ENV === 'development') {
    const outputPath = join(process.cwd(), 'swagger-spec.json');

    // Ora fs è tipizzato correttamente e non avrai più "Unsafe call"
    fs.writeFileSync(outputPath, JSON.stringify(document, null, 2), 'utf8');

    console.log(`✅ Swagger spec generata in: ${outputPath}`);
  }

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

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(async () => {
      await app.close();
    });
  }
}

bootstrap().catch((error: Error) => {
  console.error(error);
  process.exit(1);
});

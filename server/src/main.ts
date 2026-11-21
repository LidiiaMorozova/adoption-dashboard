import 'reflect-metadata';
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {configureApp} from './configure-app';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  configureApp(app);

  const corsOrigin = process.env.CORS_ORIGIN;
  if (corsOrigin) {
    app.enableCors({origin: corsOrigin.split(',').map((origin) => origin.trim())});
  }

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  console.log(`API listening on http://localhost:${port}/api`);
}

void bootstrap();

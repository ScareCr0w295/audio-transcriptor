import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { environment } from './config/environment';
import { loadEnvironment } from './config/env.config';

async function bootstrap() {
  // Load environment variables from the appropriate .env file
  loadEnvironment();
  
  const app = await NestFactory.create(AppModule);
  
  // Configure CORS
  app.enableCors({
    origin: environment.corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
  
  await app.listen(environment.port);
  console.log(`Application is running on: ${environment.apiUrl}`);
}
bootstrap();

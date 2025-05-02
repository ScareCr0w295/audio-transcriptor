import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { environment } from './config/environment';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  try {
    const logger = new Logger('Bootstrap');
    logger.log('Starting application...');
    
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    
    // Configure CORS
    app.enableCors({
      origin: environment.corsOrigins,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
    });
    
    // Log environment information
    logger.log(`Environment: ${process.env.NODE_ENV}`);
    logger.log(`API URL: ${environment.apiUrl}`);
    logger.log(`CORS Origins: ${environment.corsOrigins}`);
    
    await app.listen(environment.port);
    logger.log(`Application is running on: ${environment.apiUrl}`);
  } catch (error) {
    console.error('Application bootstrap error:', error);
    throw error;
  }
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });
console.log(frontendUrl);
console.log( process.env.FRONTEND_URL);
  // CORS configuratie - ruimer voor development
  app.enableCors({
    origin: [
      // 'http://localhost:5173',
      // 'http://localhost:5174',
      // 'http://localhost:3000',
      // 'http://localhost',
      frontendUrl,
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
  
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(3000);
  console.log('Backend running on http://localhost:3000');
}
bootstrap();

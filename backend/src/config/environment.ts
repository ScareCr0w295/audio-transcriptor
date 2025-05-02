// Environment configuration that doesn't depend on constants
interface EnvironmentConfig {
  port: number;
  isProduction: boolean;
  apiUrl: string;
  corsOrigins: string[];
}

// Parse CORS_ORIGINS from environment variable
const getCorsOrigins = () => {
  const origins = process.env.CORS_ORIGINS || 'http://localhost:4200';
  return origins.split(',').map(origin => origin.trim());
};

const developmentConfig: EnvironmentConfig = {
  port: Number(process.env.PORT) || 3000,
  isProduction: false,
  apiUrl: 'http://localhost:3000',
  corsOrigins: ['http://localhost:4200']
};

const productionConfig: EnvironmentConfig = {
  port: Number(process.env.PORT) || 3000,
  isProduction: true,
  apiUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://your-production-api-url.com',
  corsOrigins: getCorsOrigins()
};

export const environment: EnvironmentConfig = 
  (process.env.NODE_ENV === 'production') ? productionConfig : developmentConfig;
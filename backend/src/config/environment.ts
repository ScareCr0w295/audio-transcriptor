// Environment configuration using .env files
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

// Create environment configuration based on loaded .env variables
export const environment: EnvironmentConfig = {
  port: Number(process.env.PORT) || 3000,
  isProduction: process.env.NODE_ENV === 'production',
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  corsOrigins: getCorsOrigins()
};
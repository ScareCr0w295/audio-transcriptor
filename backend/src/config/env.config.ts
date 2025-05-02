import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Determine which environment file to load
export function loadEnvironment() {
  const environment = process.env.NODE_ENV || 'development';
  const envFile = `.env.${environment}`;
  const envPath = path.resolve(process.cwd(), envFile);
  
  // Check if the environment file exists
  if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    
    // Set environment variables
    for (const key in envConfig) {
      process.env[key] = envConfig[key];
    }
    
    console.log(`Loaded environment from ${envFile}`);
  } else {
    console.warn(`Environment file ${envFile} not found. Using default environment variables.`);
  }
}
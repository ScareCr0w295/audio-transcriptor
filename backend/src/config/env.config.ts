// Simplified environment loader for Vercel deployment
export function loadEnvironment() {
  // In Vercel, environment variables are already loaded
  // This function now just logs the environment for debugging
  const environment = process.env.NODE_ENV || 'development';
  console.log(`Running in ${environment} environment`);
  
  // Log some key environment variables to verify they're available
  console.log(`API_URL: ${process.env.API_URL || 'not set'}`);
  console.log(`CORS_ORIGINS: ${process.env.CORS_ORIGINS || 'not set'}`);
}
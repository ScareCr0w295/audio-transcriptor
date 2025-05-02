const fs = require('fs');

function setEnv() {
  // Target paths for environment files
  const targetPath = './src/environments/environment.prod.js';
  
  // Get environment variables from Vercel
  const apiUrl = process.env.VERCEL_API_URL || 'https://your-production-api-url.com';
  
  // Create environment file content
  const envConfigFile = `
    export const environment = {
      production: true,
      apiUrl: '${apiUrl}'
    };
  `;
  
  console.log('Generating environment file with content:\n', envConfigFile);
  
  // Write to file
  fs.writeFileSync(targetPath, envConfigFile.trim());
  console.log(`Environment file generated at ${targetPath}`);
}

setEnv();
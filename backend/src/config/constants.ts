// Define constants that don't depend on environment configuration
export const constants = {
  // API endpoints
  API: {
    TRANSCRIBE: '/transcribe',
    TRANSLATE: '/translate',
    SPEAK: '/speak'
  },
  
  // File upload configuration
  UPLOAD: {
    DESTINATION: './uploads',
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg']
  }
};
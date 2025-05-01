import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import { join } from 'path';

// Fix the import statement
import { translate } from '@vitalets/google-translate-api';

@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name);

  async translateText(text: string, targetLang: string) {
    try {
      this.logger.log(`Starting translation to ${targetLang}`);
      
      // Call the translate function directly
      const result = await translate(text, { to: targetLang });
      
      this.logger.log(`Translation completed successfully to ${targetLang}`);
      return {
        success: true,
        originalText: text,
        targetLanguage: targetLang,
        translatedText: result.text,
      };
    } catch (error) {
      this.logger.error(`Error in translation service: ${error.message}`, error.stack);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Translation service error',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

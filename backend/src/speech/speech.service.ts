import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SpeechService {
  private readonly logger = new Logger(SpeechService.name);

  async textToSpeech(text: string, language: string = 'en'): Promise<{ filePath: string }> {
    try {
      this.logger.log(`Starting text-to-speech conversion for language: ${language}`);
      
      const scriptPath = join(process.cwd(), 'ai-workers', 'speak.py');
      try {
        await fs.access(scriptPath);
      } catch (error) {
        this.logger.error(`Python script not found: ${scriptPath}`);
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Speech service unavailable',
            message: 'The speech script could not be found',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      
      const outputDir = join(process.cwd(), 'uploads', 'audio');
      await fs.mkdir(outputDir, { recursive: true });
      
      const outputFilename = `${uuidv4()}.wav`;
      const outputPath = join(outputDir, outputFilename);
      
      const pythonProcess = spawn('python', [scriptPath, text, outputPath, language]);
      
      let outputResult = '';
      let errorOutput = '';
      
      return new Promise((resolve, reject) => {
        pythonProcess.stdout.on('data', (data) => {
          outputResult += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
          const errorData = data.toString();
          errorOutput += errorData;
          this.logger.error(`Python script error: ${errorData}`);
        });
        
        pythonProcess.on('close', (code) => {
          if (code !== 0) {
            this.logger.error(`Python script exited with code ${code}`);
            reject(new HttpException(
              {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Speech generation failed',
                message: errorOutput || `Process exited with code ${code}`,
                details: {
                  language,
                  exitCode: code,
                }
              },
              HttpStatus.INTERNAL_SERVER_ERROR,
            ));
            return;
          }
          
          this.logger.log(`Speech generated successfully`);
          resolve({
            filePath: outputPath.trim(),
          });
        });
        
        pythonProcess.on('error', (error) => {
          this.logger.error(`Failed to start Python process: ${error.message}`);
          reject(new HttpException(
            {
              status: HttpStatus.INTERNAL_SERVER_ERROR,
              error: 'Speech process failed',
              message: error.message,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          ));
        });
      });
    } catch (error) {
      this.logger.error(`Error in speech service: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Speech service error',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

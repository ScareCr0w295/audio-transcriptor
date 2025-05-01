import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';

@Injectable()
export class TranscriptionService {
  private readonly logger = new Logger(TranscriptionService.name);

  async transcribeAudio(file: Express.Multer.File) {
    try {
      this.logger.log(`Starting transcription for file: ${file.originalname}`);
      
      const scriptPath = join(process.cwd(), 'ai-workers', 'transcribe.py');
      try {
        await fs.access(scriptPath);
      } catch (error) {
        this.logger.error(`Python script not found: ${scriptPath}`);
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Transcription service unavailable',
            message: 'The transcription script could not be found',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      
      const pythonProcess = spawn('python', [scriptPath, file.path]);
      
      let transcriptionResult = '';
      let errorOutput = '';
      
      return new Promise((resolve, reject) => {
        pythonProcess.stdout.on('data', (data) => {
          transcriptionResult += data.toString();
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
                error: 'Transcription failed',
                message: errorOutput || `Process exited with code ${code}`,
                details: {
                  filename: file.filename,
                  exitCode: code,
                }
              },
              HttpStatus.INTERNAL_SERVER_ERROR,
            ));
            return;
          }
          
          this.logger.log(`Transcription completed successfully`);
          resolve({
            success: true,
            message: 'File transcribed successfully',
            filename: file.filename,
            originalname: file.originalname,
            path: file.path,
            transcription: transcriptionResult.trim(),
          });
        });
        
        pythonProcess.on('error', (error) => {
          this.logger.error(`Failed to start Python process: ${error.message}`);
          reject(new HttpException(
            {
              status: HttpStatus.INTERNAL_SERVER_ERROR,
              error: 'Transcription process failed',
              message: error.message,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          ));
        });
      });
    } catch (error) {
      this.logger.error(`Error in transcription service: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Transcription service error',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

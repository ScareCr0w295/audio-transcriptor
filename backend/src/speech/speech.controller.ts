import { Controller, Post, Body, Res, HttpStatus, ValidationPipe, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { SpeechService } from './speech.service';
import { createReadStream } from 'fs';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

class TextToSpeechDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  language?: string;
}

@Controller('speak')
export class SpeechController {
  constructor(private readonly speechService: SpeechService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async textToSpeech(@Body() dto: TextToSpeechDto, @Res() res: Response) {
    try {
      // Inside your textToSpeech method
      const result = await this.speechService.textToSpeech(dto.text, dto.language);
      
      // Add logging and file existence check
      console.log(`Attempting to stream audio file: ${result.filePath}`);
      const fs = require('fs');
      if (!fs.existsSync(result.filePath)) {
        console.error(`File does not exist: ${result.filePath}`);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Speech generation failed',
          message: 'Generated audio file not found',
        });
      }
      
      // Stream the audio file back to the client
      const fileStream = createReadStream(result.filePath);
      
      res.set({
        'Content-Type': 'audio/wav',
        'Content-Disposition': `attachment; filename="speech.wav"`,
      });
      
      fileStream.pipe(res);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Speech generation failed',
        message: error.message,
      });
    }
  }
}

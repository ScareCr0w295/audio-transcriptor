import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TranscriptionModule } from './transcription/transcription.module';
import { TranslationModule } from './translation/translation.module';
import { SpeechModule } from './speech/speech.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? [] : ['.env.development'],
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    TranscriptionModule,
    TranslationModule,
    SpeechModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
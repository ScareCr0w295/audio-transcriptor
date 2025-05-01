import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { TranslateDto } from './translation.dto';

@Controller('translate')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async translateText(@Body() translateDto: TranslateDto) {
    return this.translationService.translateText(
      translateDto.text,
      translateDto.targetLang,
    );
  }
}

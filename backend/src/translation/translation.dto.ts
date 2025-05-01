import { IsNotEmpty, IsString } from 'class-validator';

export class TranslateDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  targetLang: string;
}
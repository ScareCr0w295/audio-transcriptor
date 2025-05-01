import { Component, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeInStagger', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0 }),
          stagger(100, [
            animate('0.5s ease-out', style({ opacity: 1 }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('slideInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('fadeUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class HomeComponent {
  selectedFile: File | null = null;
  targetLanguage: string = 'en';
  originalText: string = '';
  translatedText: string = '';
  translatedAudioUrl: string | null = null;
  isLoading: boolean = false;
  detectedLanguage: string = '';
  targetLanguageName: string = 'English';
  showResults: boolean = false;

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) { }

  onFileSelected(file: File) {
    this.selectedFile = file;
    // Reset results when a new file is selected
    this.originalText = '';
    this.translatedText = '';
    this.translatedAudioUrl = null;
    this.detectedLanguage = '';
  }

  onLanguageSelected(language: {code: string, name: string}) {
    this.targetLanguage = language.code;
    this.targetLanguageName = language.name;
  }

  async startTranslation() {
    if (!this.selectedFile) {
      this.snackBar.open('Please select an audio file first', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    this.showResults = false;

    try {
      // Step 1: Transcribe the audio
      const transcriptionResult = await firstValueFrom(this.apiService.transcribeAudio(this.selectedFile));
      this.originalText = transcriptionResult.transcription;
      this.detectedLanguage = transcriptionResult.detectedLanguage || 'English';

      // Step 2: Translate the transcription
      const translationResult = await firstValueFrom(this.apiService.translateText(
        this.originalText,
        this.targetLanguage
      ));
      this.translatedText = translationResult.translatedText;

      // Step 3: Convert translated text to speech
      try {
        const audioBlob = await firstValueFrom(this.apiService.textToSpeech(
          this.translatedText,
          this.targetLanguage
        ));
        
        if (audioBlob && audioBlob.size > 0) {
          const reader = new FileReader();
          reader.onload = () => {
            this.translatedAudioUrl = reader.result as string;
            this.showResults = true;
            this.cdr.detectChanges();
          };
          reader.onerror = () => {
            this.snackBar.open('Failed to generate audio preview', 'Close', { duration: 3000 });
            this.showResults = true;
          };
          reader.readAsDataURL(audioBlob);
        } else {
          this.snackBar.open('Failed to generate audio', 'Close', { duration: 3000 });
          this.showResults = true;
        }
      } catch (error) {
        this.snackBar.open('Failed to generate audio', 'Close', { duration: 3000 });
        this.showResults = true;
      }

      this.isLoading = false;
    } catch (error) {
      console.error('Error in translation process:', error);
      this.isLoading = false;
      this.showResults = true;
      this.snackBar.open('An error occurred during processing', 'Close', { duration: 5000 });
    }
  }
}
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-transcription-result',
  templateUrl: './transcription-result.component.html',
  styleUrls: ['./transcription-result.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-in', style({ opacity: 1 }))
      ])
    ]),
    trigger('staggerItems', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('pulseAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class TranscriptionResultComponent implements OnInit, OnChanges {
  @Input() originalText: string = '';
  @Input() translatedText: string = '';
  @Input() audioUrl: string | null = null;
  @Input() isLoading: boolean = false;
  @Input() detectedLanguage: string = 'English';
  @Input() targetLanguage: string = 'English';

  sanitizedAudioUrl: SafeUrl | null = null;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.updateSanitizedUrl();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['audioUrl']) {
      this.updateSanitizedUrl();
    }
  }

  updateSanitizedUrl() {
    if (this.audioUrl) {
      this.sanitizedAudioUrl = this.sanitizer.bypassSecurityTrustUrl(this.audioUrl);
    } else {
      this.sanitizedAudioUrl = null;
    }
  }

  handleAudioError(event: any) {
    console.error('Audio playback error:', event);
  }
}
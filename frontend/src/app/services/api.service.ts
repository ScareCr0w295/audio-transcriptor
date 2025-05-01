import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000'; // Adjust this to your NestJS backend URL

  constructor(private http: HttpClient) {}

  // Upload audio file for transcription
  transcribeAudio(audioFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', audioFile);
    return this.http.post(`${this.apiUrl}/transcribe`, formData).pipe(
      catchError(error => {
        console.error('Transcription error:', error);
        return throwError(() => new Error('Failed to transcribe audio: ' + (error.message || 'Unknown error')));
      })
    );
  }

  // Translate text to target language
  translateText(text: string, targetLang: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/translate`, { text, targetLang }).pipe(
      catchError(error => {
        console.error('Translation error:', error);
        return throwError(() => new Error('Failed to translate text: ' + (error.message || 'Unknown error')));
      })
    );
  }

  // Convert text to speech
  textToSpeech(text: string, language: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Accept': 'audio/wav',
      'Content-Type': 'application/json'
    });
    
    return this.http.post(`${this.apiUrl}/speak`, { text, language }, {
      responseType: 'blob',
      headers: headers,
      observe: 'response'
    }).pipe(
      map((response: any) => {
        return new Blob([response.body], { 
          type: response.headers.get('Content-Type') || 'audio/wav' 
        });
      }),
      catchError(error => {
        console.error('Text-to-speech error:', error);
        return throwError(() => new Error('Failed to generate speech: ' + (error.message || 'Unknown error')));
      })
    );
  }
}
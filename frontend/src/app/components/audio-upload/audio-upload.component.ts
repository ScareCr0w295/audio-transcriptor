import { Component, EventEmitter, Output, NgZone } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-audio-upload',
  templateUrl: './audio-upload.component.html',
  styleUrls: ['./audio-upload.component.scss']
})
export class AudioUploadComponent {
  @Output() fileSelected = new EventEmitter<File>();
  
  selectedFile: File | null = null;
  isRecording = false;
  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];
  audioPreviewUrl: SafeUrl | null = null;
  
  constructor(private sanitizer: DomSanitizer, private zone: NgZone) {}
  
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.includes('audio')) {
      this.selectedFile = file;
      this.createAudioPreview(file);
      this.fileSelected.emit(file);
    }
  }
  
  async startRecording() {
    this.audioChunks = [];
    this.isRecording = true;
    this.audioPreviewUrl = null;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      
      this.mediaRecorder.onstop = () => {
        if (this.audioChunks.length === 0) return;
        
        this.zone.run(() => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
          this.selectedFile = audioFile;
          this.createAudioPreview(audioBlob);
          this.fileSelected.emit(audioFile);
        });
      };
      
      this.mediaRecorder.start(1000);
    } catch (error) {
      this.isRecording = false;
    }
  }
  
  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.requestData();
      this.mediaRecorder.stop();
      this.isRecording = false;
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  }
  
  createAudioPreview(blobOrFile: Blob | File) {
    if (this.audioPreviewUrl) {
      URL.revokeObjectURL(this.audioPreviewUrl as string);
    }
    
    const url = URL.createObjectURL(blobOrFile);
    this.audioPreviewUrl = this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriptionResultComponent } from './transcription-result.component';

describe('TranscriptionResultComponent', () => {
  let component: TranscriptionResultComponent;
  let fixture: ComponentFixture<TranscriptionResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranscriptionResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranscriptionResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

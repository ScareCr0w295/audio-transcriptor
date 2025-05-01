import sys
import os
from pathlib import Path
import torch
from transformers import AutoProcessor, AutoModel

# Get arguments
text = sys.argv[1]
output_path = sys.argv[2]
language = sys.argv[3] if len(sys.argv) > 3 else "en"

# Create output directory if it doesn't exist
output_dir = os.path.dirname(output_path)
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Map language code to speaker ID for multi-lingual models
language_to_speaker = {
    "en": 0,  # English
    "es": 1,  # Spanish
    "fr": 2,  # French
    "de": 3,  # German
    "it": 4,  # Italian
    "pt": 5,  # Portuguese
    "pl": 6,  # Polish
    "tr": 7,  # Turkish
    "ru": 8,  # Russian
    "nl": 9,  # Dutch
    "cs": 10, # Czech
    "ar": 11, # Arabic
    "zh": 12, # Chinese
    "ja": 13, # Japanese
    "hu": 14, # Hungarian
    "ko": 15  # Korean
}

try:
    # Load model and processor
    processor = AutoProcessor.from_pretrained("facebook/mms-tts-eng")
    model = AutoModel.from_pretrained("facebook/mms-tts-eng")
    
    # Get speaker ID based on language
    speaker_id = language_to_speaker.get(language, 0)  # Default to English
    
    # Process text and generate speech
    inputs = processor(
        text=text,
        return_tensors="pt"
    )
    
    # Generate speech
    with torch.no_grad():
        output = model(**inputs, speaker_id=speaker_id).waveform
    
    # Save as WAV file
    import scipy.io.wavfile as wavfile
    # Convert to numpy array and scale to int16 range
    audio_data = output.squeeze().numpy()
    audio_data = (audio_data * 32767).astype("int16")
    # Save as WAV file (16kHz sample rate)
    wavfile.write(output_path, 16000, audio_data)
    
    print(output_path)
    sys.exit(0)
except Exception as e:
    print(f"Error generating speech: {str(e)}")
    sys.exit(1)
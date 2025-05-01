import sys
from faster_whisper import WhisperModel

model = WhisperModel("base", device="cpu")
segments, _ = model.transcribe(sys.argv[1])
result = " ".join([seg.text for seg in segments])
print(result)
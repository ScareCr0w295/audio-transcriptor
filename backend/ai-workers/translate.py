import sys
from transformers import MarianMTModel, MarianTokenizer

text = sys.argv[1]
target_lang = sys.argv[2]

# Map target language code to model name
lang_to_model = {
    "es": "Helsinki-NLP/opus-mt-en-es",
    "fr": "Helsinki-NLP/opus-mt-en-fr",
    "de": "Helsinki-NLP/opus-mt-en-de",
    "it": "Helsinki-NLP/opus-mt-en-it",
    "pt": "Helsinki-NLP/opus-mt-en-ROMANCE",
    "ru": "Helsinki-NLP/opus-mt-en-ru",
    "zh": "Helsinki-NLP/opus-mt-en-zh",
    "ja": "Helsinki-NLP/opus-mt-en-jap"
    # Add more language pairs as needed
}

# Default to English-Spanish if language not supported
model_name = lang_to_model.get(target_lang, "Helsinki-NLP/opus-mt-en-es")

try:
    tokenizer = MarianTokenizer.from_pretrained(model_name)
    model = MarianMTModel.from_pretrained(model_name)
    
    # Translate
    translated = model.generate(**tokenizer(text, return_tensors="pt", padding=True))
    result = tokenizer.decode(translated[0], skip_special_tokens=True)
    print(result)
except Exception as e:
    print(f"Translation error: {str(e)}")
    sys.exit(1)
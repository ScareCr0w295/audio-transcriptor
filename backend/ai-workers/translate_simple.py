import sys

text = sys.argv[1] if len(sys.argv) > 1 else "No text provided"
target_lang = sys.argv[2] if len(sys.argv) > 2 else "es"

# Just echo back the inputs for testing
print(f"Would translate '{text}' to {target_lang}")
print(f"Example translation: Hola mundo!")
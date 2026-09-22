# VOXYFY • Shikamaru AI

A futuristic Flask AI workspace with a Shikamaru-inspired strategic companion.

## What this version contains

- Futuristic responsive VOXYFY interface
- Animated strategic companion
- Working chat interface
- Working sidebar panels
- Browser-based recent prompt history
- Theme switcher
- Model selector
- OpenRouter backend
- Server-side API key handling
- Demo mode when no API key is configured
- Gunicorn production entry point
- `start.bat` for Windows local launch
- `start.sh` for Linux/macOS local launch

## OpenRouter setup

Create a local `.env` file from `.env.example` and add:

```text
OPENROUTER_API_KEY=your_openrouter_key
VOXYFY_MODEL=gpt-5.6-sol
```

The backend sends `gpt-5.6-sol` to OpenRouter as:

```text
openai/gpt-5.6-sol
```

Do NOT put your real API key in GitHub, JavaScript, HTML, or CSS.

## Render

Use:

```text
Build Command:
pip install -r requirements.txt

Start Command:
gunicorn app:app
```

Add these Render environment variables:

```text
OPENROUTER_API_KEY = your real OpenRouter key
VOXYFY_MODEL = gpt-5.6-sol
```

## Local run

```bash
pip install -r requirements.txt
python app.py
```

Or use `start.bat` on Windows.

## Character note

The included visual is an original anime-inspired strategic companion rather than a direct reproduction of official Naruto/Shikamaru artwork.

# VOXYFY Complete AI Support Website

## What this version contains
- Futuristic responsive VOXYFY interface
- Original Shikamaru anime-inspired strategic companion
- Animated HUD, rings, scan beam and character idle/thinking states
- Magnetic buttons and hover effects
- Chat history in browser localStorage
- Model selector for Astra / Sol / Terra / Luna
- Flask backend
- OpenAI Responses API integration
- Server-side API key handling
- Demo mode when no API key is configured
- Production-ready Gunicorn entry point

## 1. Install
Python 3.10+ is recommended.

```bash
pip install -r requirements.txt
```

## 2. Configure OpenAI
Copy `.env.example` to `.env` and put your API key in `OPENAI_API_KEY`.

Do NOT put the API key in `static/app.js` or `templates/index.html`.

## 3. Run
```bash
python app.py
```

Open:
http://127.0.0.1:5000

## 4. Deploy
Use a Python web service that supports Gunicorn.

Start command:
```bash
gunicorn app:app
```

Set `OPENAI_API_KEY` and optionally `VOXYFY_MODEL` in the host's environment variables.

## 5. Model switching
The UI supports:
- gpt-6-astra
- gpt-5.6-sol
- gpt-5.6-terra
- gpt-5.6-luna

The model list is controlled server-side in `app.py`.

## Important
This is an original Shikamaru visual identity. It is inspired by the idea of a calm, tactical anime strategist, but it does not reproduce a specific Naruto character's exact artwork.

## Next upgrades
Voice, image upload, web search, file search, persistent user accounts, database-backed conversations, streaming token animation, richer character facial animation, and admin analytics can be added as separate modules.


## Character animation update
The companion continuously moves with a subtle forward/back depth effect, vertical motion, and idle breathing-style scale changes. Thinking mode switches to a faster motion loop.

## Character artwork note
The included artwork remains an original anime-inspired strategist rather than a direct reproduction of the Naruto/Shikamaru character artwork. If you have rights to use official Shikamaru artwork, you can replace the character artwork with your licensed asset.

# Claude Integration

## Purpose
This file documents the Claude AI integration for the GMPL Chairman's Intelligence Dashboard.

## Source
- `src/lib/claude.js`

## API Endpoint
- `https://api.anthropic.com/v1/messages`

## Model
- Default: `claude-sonnet-4-20250514`
- Override with `VITE_CLAUDE_MODEL`

## Environment Variables
- `VITE_CLAUDE_API_KEY`
  - Required for live Claude AI calls
  - Should be stored in `.env`, Vercel environment settings, or equivalent deployment secret store
- `VITE_CLAUDE_MODEL`
  - Optional override of the Claude model name
  - Defaults to `claude-sonnet-4-20250514` if unset

## Integration behavior
- When `VITE_CLAUDE_API_KEY` is not set, the app returns a placeholder message:
  - `Claude AI is unavailable. Set VITE_CLAUDE_API_KEY in your .env file to enable live AI.`
- Uses `Authorization: Bearer <API_KEY>` header for requests.
- Uses `Content-Type: application/json`.

## Functions
- `callClaude(messages, maxTokens = 800)`
  - Sends chat messages to Claude
  - Returns generated text or an error placeholder
- `generateTalkingPoints(matter)`
- `generateVesselBriefing(vessel)`
- `draftEmail(recipient, subject, context)`
- `chatWithAssistant(history, userMessage)`

## Notes
- This integration is frontend-only and expects Vite to expose `import.meta.env` values.
- Ensure secrets are never committed to source control.

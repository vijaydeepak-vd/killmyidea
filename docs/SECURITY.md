# Security

## Secrets

Never commit:

``` text
backend/.env
frontend/.env.local
```

The repository's root `.gitignore` ignores `.env` files and allows
`.env.example`.

## API key boundary

Ollama and Tavily credentials are read by the backend.

The frontend receives analysis results, not provider credentials.

## Logging

Provider implementations intentionally avoid logging:

-   API keys
-   authorization headers
-   user ideas

Errors are logged by exception type/status rather than credential
material.

## Retrieved content

Web research is treated as untrusted input.

The AI prompt explicitly tells the model not to follow instructions
found inside retrieved evidence.

## URL validation

Research URLs must be HTTP/HTTPS URLs.

AI-generated URLs are only retained when they exactly match URLs in the
evidence pack.

## CORS

Configure explicit production origins through:

``` env
CORS_ORIGINS=https://your-frontend.example
```

Avoid wildcard origins for authenticated/private deployments.

## Rate limiting

The current `/api/analyze` endpoint does not implement application-level
rate limiting.

A public deployment should add:

-   request rate limits
-   abuse protection
-   authentication if required
-   provider usage controls

## Credential rotation

If a provider key has ever been exposed in:

-   chat
-   logs
-   screenshots
-   Git history
-   CI output

revoke it and generate a replacement.

Deleting the visible file is not sufficient if the credential was
already exposed.

## Open-source release checklist

-   [ ] Rotate all development credentials
-   [ ] Run a secret scanner
-   [ ] Inspect Git history
-   [ ] Verify `.env` is ignored
-   [ ] Verify `.env.example` contains placeholders only
-   [ ] Remove internal/private dependency references
-   [ ] Review logs
-   [ ] Review CORS
-   [ ] Add rate limiting before public hosted use

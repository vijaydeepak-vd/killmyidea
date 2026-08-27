# Troubleshooting

## Backend does not start

The current `server.py` reads these variables directly during startup:

``` env
MONGO_URL=
DB_NAME=
```

If they are missing, startup can fail before `/api/analyze` is
reachable.

Set both values in `backend/.env`.

## Frontend cannot reach the API

Check:

``` env
REACT_APP_BACKEND_URL=http://localhost:8000
```

Then restart the React development server.

Create React App environment variables are loaded when the
development/build process starts.

## Research unavailable

Check:

``` env
TAVILY_API_KEY=
TAVILY_BASE_URL=https://api.tavily.com
```

Also verify that the backend process can reach Tavily.

The application intentionally returns an unavailable/partial research
state instead of fabricating evidence.

## AI analysis unavailable

Check:

``` env
OLLAMA_API_KEY=
OLLAMA_BASE_URL=https://ollama.com/v1/
OLLAMA_MODEL=gemma4:31b-cloud
```

The provider retries transient failures once.

If both attempts fail, the backend returns
`503 ai_analysis_unavailable`.

## Tavily usage

Each analysis performs a bounded batch of four search requests.

There is currently no application-level rate limiter.

Do not expose an unrestricted public deployment without adding abuse
protection.

## MongoDB

MongoDB is currently initialized by the FastAPI application.

If you want to remove MongoDB entirely, that is an architectural change
and should be handled as a separate refactor.

The frontend verdict history does not use MongoDB; it uses browser
localStorage.

## Emergent-specific dependencies

The current dependency manifests contain Emergent-hosted
packages/assets.

Examples include an Emergent-hosted `litellm` wheel in
`backend/requirements.txt` and an Emergent visual-edits package in
`frontend/package.json`.

For a fully independent open-source installation, audit these
dependencies and remove/replace them if they are not required by the
actual source code.

Do not document an independent installation as fully reproducible until
this dependency audit is complete.

## Empty or incorrect README

The repository's original root README was still an Emergent placeholder
at the time of documentation generation.

Replace it with the project README supplied with this documentation set.

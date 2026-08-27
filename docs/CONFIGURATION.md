# Configuration

## Backend environment

Create:

``` text
backend/.env
```

from:

``` text
backend/.env.example
```

Current variables:

  --------------------------------------------------------------------------
  Variable                Required                Purpose
  ----------------------- ----------------------- --------------------------
  `MONGO_URL`             Yes                     MongoDB connection string
                                                  used by the FastAPI
                                                  application

  `DB_NAME`               Yes                     MongoDB database name

  `CORS_ORIGINS`          Recommended             Comma-separated frontend
                                                  origins

  `OLLAMA_API_KEY`        Yes for live AI         Ollama Cloud
                                                  authentication

  `OLLAMA_BASE_URL`       No                      Defaults to
                                                  `https://ollama.com/v1/`

  `OLLAMA_MODEL`          No                      Defaults to
                                                  `gemma4:31b-cloud`

  `TAVILY_API_KEY`        Yes for live research   Tavily authentication

  `TAVILY_BASE_URL`       No                      Defaults to
                                                  `https://api.tavily.com`
  --------------------------------------------------------------------------

Example:

``` env
MONGO_URL=mongodb://localhost:27017
DB_NAME=killmyidea
CORS_ORIGINS=http://localhost:3000

OLLAMA_API_KEY=replace-me
OLLAMA_BASE_URL=https://ollama.com/v1/
OLLAMA_MODEL=gemma4:31b-cloud

TAVILY_API_KEY=replace-me
TAVILY_BASE_URL=https://api.tavily.com
```

## Frontend environment

The frontend uses Create React App environment variables.

Create:

``` text
frontend/.env.local
```

Example:

``` env
REACT_APP_BACKEND_URL=http://localhost:8000
```

The frontend API adapter reads this value at runtime/build time.

## Credential handling

Never place:

-   Ollama keys
-   Tavily keys
-   MongoDB credentials

in frontend source code.

Never commit `.env` or `.env.local`.

The repository provides `backend/.env.example` with placeholders only.

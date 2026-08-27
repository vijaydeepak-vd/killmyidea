# Setup

This guide describes the current repository structure and local
development flow.

## Requirements

Recommended:

-   Node.js 20+
-   Yarn 1.22.x
-   Python 3.10+
-   MongoDB
-   Ollama Cloud API key
-   Tavily API key

## Clone

``` bash
git clone https://github.com/vijaydeepak-vd/killmyidea.git
cd killmyidea
```

## Backend

``` bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Configure the environment variables described in `CONFIGURATION.md`.

Start FastAPI:

``` bash
uvicorn server:app --host 0.0.0.0 --port 8000
```

## Frontend

Open a second terminal:

``` bash
cd frontend
yarn install
```

Create the frontend environment file:

``` env
REACT_APP_BACKEND_URL=http://localhost:8000
```

Start:

``` bash
yarn start
```

Open:

``` text
http://localhost:3000
```

## Development flow

Keep the backend running on port 8000 and the React development server
on port 3000.

The frontend sends live analyses to:

``` text
${REACT_APP_BACKEND_URL}/api/analyze
```

## Demo without API calls

The landing page includes deterministic demo ideas.

Use the example analysis when you want to demonstrate the interface
without consuming live Tavily/Ollama usage.

## Production build

Frontend:

``` bash
cd frontend
yarn build
```

The current frontend is configured as a Create React App/CRACO
application.

## Notes

The current backend initializes MongoDB during application startup. Even
if you only care about `/api/analyze`, provide a valid `MONGO_URL` and
`DB_NAME`.

Before an independent OSS release, remove or replace any
Emergent-specific dependencies referenced by the manifests.

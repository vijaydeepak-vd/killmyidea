# Architecture

KillMyIdea is a React + FastAPI application with a live research/LLM
pipeline.

## High-level architecture

``` text
+--------------------+
| React frontend     |
| React 19 / CRA     |
+---------+----------+
          |
          | POST /api/analyze
          v
+---------+----------+
| FastAPI backend    |
+---------+----------+
          |
          +------------------+
          |                  |
          v                  v
+---------+----------+  +----+----------------+
| ResearchEngine     |  | OllamaCloudProvider |
| Tavily provider    |  | Gemma 4 31B Cloud   |
+---------+----------+  +---------------------+
          |
          v
   Evidence Pack
          |
          +--------------------+
                               |
                               v
                    Structured IdeaAnalysis
                               |
                               v
                    React Results experience
```

## Frontend

The frontend entry point is `frontend/src/index.js`. It initializes
React 19, TanStack Query and the main `App` component.

`App.js` manages the primary application states:

-   `landing`
-   `input`
-   `analyzing`
-   `results`

It also manages demo/live mode and client-side verdict history.

The live API adapter is `frontend/src/data/analysisService.js`.

The frontend validates and maps the backend response before rendering
it.

## Backend

The backend is a FastAPI application in `backend/server.py`.

The main analysis route is:

``` text
POST /api/analyze
```

The route:

1.  validates the request with Pydantic
2.  calls `ResearchEngine.research`
3.  calls `analyze_with_ai`
4.  returns research metadata and the validated analysis

## Research layer

`backend/research_engine.py` owns evidence gathering.

The provider is injectable:

``` python
ResearchEngine(provider=...)
```

The default provider is `TavilySearchProvider`.

This makes the search provider replaceable without rewriting the
analysis layer.

## AI layer

`backend/analysis_service.py` constructs the system and user prompts and
sends them to `OllamaCloudProvider`.

The default model is:

``` text
gemma4:31b-cloud
```

The provider uses Ollama's OpenAI-compatible `/v1/chat/completions`
endpoint.

## Data contracts

`backend/analysis_models.py` defines Pydantic models for:

-   factors
-   brutal reality findings
-   evidence
-   improvements
-   overall analysis

The model response must validate against these contracts before it
reaches the frontend.

## Persistence

The current application uses two different persistence approaches:

### MongoDB

`server.py` initializes a MongoDB client and exposes legacy/general
status endpoints:

-   `GET /api/`
-   `POST /api/status`
-   `GET /api/status`

### Browser localStorage

Verdict history is stored in the browser using the `kmi-history` key.

The application keeps the latest eight entries.

This means the core analysis result is not currently persisted as a
server-side record.

## Failure behavior

Research failure:

``` text
Tavily unavailable
      |
      v
Research status = unavailable/partial
      |
      v
AI is instructed not to claim live research
```

Ollama failure:

``` text
Ollama timeout / transient 5xx / 429
      |
      v
one retry after 3 seconds
      |
      v
analysis unavailable
      |
      v
frontend uses its deterministic fallback path
```

Malformed model output is rejected rather than displayed as if it were
valid structured analysis.

## Security boundary

API credentials remain on the backend.

The frontend only receives the analysis response and never receives the
Ollama or Tavily credentials.

## Important implementation note

The current repository was generated/iterated using Emergent. Some
dependency manifests still reference Emergent-hosted assets. See
`docs/TROUBLESHOOTING.md` before treating the repository as a fully
independent build.

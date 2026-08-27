# API Reference

Base URL example:

``` text
http://localhost:8000
```

## GET `/api/`

Basic API route.

Response:

``` json
{
  "message": "Hello World"
}
```

## POST `/api/status`

Creates a status-check record in MongoDB.

Request:

``` json
{
  "client_name": "local-dev"
}
```

## GET `/api/status`

Returns stored status-check records.

## POST `/api/analyze`

Runs the main KillMyIdea pipeline.

### Request

``` json
{
  "idea": "An AI tool that creates task-specific context packages for coding agents from GitHub issues.",
  "target": "Engineering teams using AI coding agents",
  "monetization": "Subscription",
  "differentiation": "Turns GitHub issues into ready-to-use context packages for coding agents.",
  "problem": "Coding agents fail on large repositories because they lack the right context."
}
```

### Validation

Current backend constraints:

  Field               Constraint
  ------------------- -------------------------------
  `idea`              10--4000 characters
  `target`            2--500 characters
  `monetization`      optional, max 100 characters
  `differentiation`   5--2000 characters
  `problem`           optional, max 2000 characters

### Response shape

The response contains:

``` json
{
  "source": "ollama-cloud",
  "model": "gemma4:31b-cloud",
  "label": "Live Research + AI Analysis",
  "researchStatus": "success",
  "research": {},
  "analysis": {}
}
```

`researchStatus` can be:

``` text
success
partial
unavailable
```

The `analysis` object contains the validated `IdeaAnalysis` structure.

### Failure

If the AI provider cannot produce a valid analysis, the API returns:

``` http
503 Service Unavailable
```

with:

``` json
{
  "detail": "ai_analysis_unavailable"
}
```

## CORS

Allowed origins are configured through:

``` env
CORS_ORIGINS=http://localhost:3000
```

Multiple origins can be supplied as a comma-separated list.

For production, avoid using a wildcard origin unless the deployment is
intentionally public and compatible with your credential policy.

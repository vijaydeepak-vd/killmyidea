# Testing

## Backend tests

The repository includes tests for the AI analysis and research pipeline.

### Analysis service tests

`backend/test_analysis_service.py` checks:

-   malformed model output
-   fenced JSON output
-   valid structured output
-   invalid improvement projection
-   missing factor fields
-   source URL sanitization
-   solution coverage behavior without an evidence pack

Run:

``` bash
cd backend
pytest test_analysis_service.py
```

### Research pipeline tests

`backend/test_research_pipeline.py` uses an injected stub search
provider.

It verifies:

-   evidence pack creation
-   finding URLs
-   confidence assignment
-   evidence-pack prompt construction
-   unavailable-research prompt behavior
-   AI analysis with a research pack
-   model URLs are restricted to evidence-pack URLs

Run:

``` bash
pytest test_research_pipeline.py
```

## Frontend tests

The frontend uses the Create React App test runner:

``` bash
cd frontend
yarn test
```

## Manual verification checklist

Before a release, verify:

### Live research

-   [ ] Submit a real idea
-   [ ] Research timestamp appears
-   [ ] Live research status is shown correctly
-   [ ] Sources open correctly
-   [ ] Competitors and pricing evidence appear

### Research failure

-   [ ] Remove/disable Tavily credentials
-   [ ] Confirm the UI says research is unavailable/partial
-   [ ] Confirm the app does not invent live evidence

### AI failure

-   [ ] Simulate Ollama failure
-   [ ] Confirm the application degrades cleanly
-   [ ] Confirm malformed model output is rejected

### UI

-   [ ] Light theme
-   [ ] Dark theme
-   [ ] Mobile layout
-   [ ] History persists after refresh
-   [ ] Score breakdown expands correctly
-   [ ] No browser console errors

## Testing principle

A failure path must be tested as carefully as the happy path.

For this project, the most important invariant is:

> **When evidence is unavailable, the product must never pretend that
> evidence exists.**

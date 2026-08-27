# AI Analysis

The AI analysis layer is implemented in:

``` text
backend/analysis_service.py
backend/ollama_provider.py
backend/analysis_models.py
```

## Model

The default model is:

``` text
gemma4:31b-cloud
```

It is called through Ollama Cloud's OpenAI-compatible API.

## Provider behavior

The provider performs one non-streaming chat completion per analysis.

Current settings include:

``` text
temperature = 0.2
```

Transient failures such as:

-   timeouts
-   connection failures
-   HTTP 429
-   HTTP 500
-   HTTP 502
-   HTTP 503
-   HTTP 504

are retried once after a three-second delay.

## Analysis philosophy

The system prompt explicitly instructs the model to:

-   challenge the idea
-   avoid generic encouragement
-   avoid inventing market facts
-   avoid inventing competitors
-   avoid inventing citations
-   identify insufficient evidence
-   separate evidence from inference
-   avoid claiming it performed web research itself
-   return exactly one structured JSON object

## Input

The AI receives:

-   project idea
-   target audience
-   monetization model
-   claimed differentiation
-   problem statement
-   evidence pack, when available

## Output contract

The model must return:

-   overall viability score
-   kill-risk score
-   verdict
-   confidence
-   summary
-   eight factor objects
-   brutal reality findings
-   risks
-   evidence
-   improvement information
-   optional projected score
-   solution coverage

Pydantic validates the structure.

## Malformed output

The backend extracts a JSON object even if the model wraps it in a
Markdown JSON fence.

If validation fails, the backend returns no analysis rather than showing
an unvalidated response.

## Improvement guardrail

An improvement is accepted only when:

``` text
improvementAvailable == true
AND
projectedViabilityScore > overallViabilityScore
```

Otherwise the backend disables the improvement.

This prevents the model from inventing an improvement that does not
actually improve the score.

## Citation guardrail

If live research exists, a model source URL is retained only if it is
exactly present in the evidence pack.

If there is no evidence pack:

-   source URLs are removed
-   solution coverage is cleared
-   the model is told that live research is unavailable

## Important limitation

The system reduces hallucination risk through evidence grounding, schema
validation and URL sanitization, but it does not make hallucinations
mathematically impossible.

The output remains an AI-assisted decision-support artifact.

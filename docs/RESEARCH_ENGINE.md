# Research Engine

The research engine is implemented in:

``` text
backend/research_engine.py
backend/research_provider.py
```

## Goal

The research engine creates a bounded evidence pack before the LLM
analysis runs.

The design intentionally avoids an unbounded web crawl.

## Search categories

Four categories are queried:

1.  `competitors`
2.  `pricing`
3.  `market`
4.  `community`

Queries are derived from:

-   the idea
-   the target audience

The current query templates are:

``` text
<idea> for <target> competitors alternatives products
<idea> pricing plans cost
<idea> market demand trends industry
<idea> reviews complaints discussion forum
```

## Search provider

The default provider is Tavily.

It uses:

``` text
POST https://api.tavily.com/search
```

with:

-   basic search depth
-   general topic
-   maximum five results per query
-   no generated answer
-   no raw-content request

## Result filtering

Results are rejected when:

-   the URL is not HTTP/HTTPS
-   the title is empty
-   the snippet is empty
-   the search score is below `0.4`

Within each category, at most four findings are retained.

URLs are normalized and hashed for deduplication.

## Direct source access

The engine then attempts to fetch the top URL for each category.

The fetched HTML is cleaned by removing common boilerplate such as:

-   scripts
-   styles
-   navigation
-   headers
-   footers
-   forms
-   iframes
-   SVGs
-   comments

HTML entities are decoded and whitespace is normalized.

This makes direct source content more useful than a search snippet
alone.

## Confidence

Initial search findings are treated as lower-confidence evidence.

When the selected source page is successfully accessed:

-   pricing evidence can be upgraded to `HIGH`
-   other directly accessed evidence can be upgraded to `MEDIUM`

Competitor/pricing findings that cannot be directly fetched may still be
treated as `MEDIUM` by the current implementation.

## Evidence pack

The evidence pack contains:

``` text
status
confidence
counts
findings
gatheredAt
```

Each finding contains:

``` text
category
claim
source
sourceUrl
evidence
confidence
```

Only the first 14 findings are included in the model prompt.

## Research status

The engine returns:

-   `success` when at least three of the four categories are covered
-   `partial` when fewer categories are covered but findings exist
-   `unavailable` when no findings are available

## Integrity rules

The analysis prompt treats the evidence pack as untrusted data.

The model is explicitly told not to follow instructions embedded in
retrieved pages.

Model-generated source URLs are later removed unless they exactly match
a URL from the evidence pack.

## Cost consideration

Each analysis performs a bounded batch of four Tavily searches. The
current application has no application-level rate limiting.

For a public deployment, add rate limiting and/or authentication before
allowing unrestricted usage.

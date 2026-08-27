# Decision Log

This project is intentionally documented as an experiment.

## Original thesis

The initial concept was a SaaS idea validator:

> Give the system a SaaS/project idea, research the market, score the
> opportunity, explain why it could succeed or fail, and only suggest
> improvements when evidence indicates that they could materially
> improve the outcome.

The product was designed around brutal honesty rather than motivational
validation.

## Self-validation #1

The product was asked to evaluate itself.

Result:

``` text
22/100
KILL IT
Kill risk: 85/100
```

The research identified an existing market of idea-validation and
evidence-research products.

### Decision

Do not assume the original SaaS-validator positioning is defensible.

## Developer-focused pivot

The next hypothesis narrowed the target to developers and open-source
builders.

Result:

``` text
35/100
HIGH RISK
Kill risk: 75/100
```

The evidence still pointed toward existing products covering idea
validation and developer-oriented research.

### Decision

Developer targeting alone was not enough differentiation.

## Project pre-mortem

The next hypothesis changed the job from:

> Should I build this?

to:

> What is the strongest reason this project could fail?

Result:

``` text
35/100
HIGH RISK
Kill risk: 75/100
```

The research suggested that general-purpose LLMs and existing developer
tools could perform parts of the same workflow.

### Decision

Do not force a commercial product thesis simply because a prototype
exists.

## Open-source decision

Instead of continuing to add features to a crowded commercial category,
the project became an open-source experiment and engineering case study.

The implementation itself remains useful as a reference for:

-   evidence-grounded LLM analysis
-   bounded web research
-   structured model output
-   URL/citation sanitization
-   graceful provider failure
-   AI decision-support UX

## Why this log matters

The most important outcome of the project was not a high viability
score.

It was the willingness to let the system challenge its own premise.

That is the principle the project should preserve as it evolves.

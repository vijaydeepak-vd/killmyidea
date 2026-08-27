# Scoring Methodology

KillMyIdea deliberately does **not** claim to calculate a statistical
probability of success.

## Live analysis

The live model returns two primary scores:

-   `overallViabilityScore`
-   `killRiskScore`

Both are constrained to 0--100.

The model also returns eight factor scores:

1.  Problem Strength
2.  Market Opportunity
3.  Competition
4.  Differentiation
5.  Monetization
6.  Distribution
7.  Execution Feasibility
8.  Defensibility

## What the scores mean

The scores are structured reasoning outputs.

They are intended to answer:

> Given the user input and the available evidence, how compelling is the
> opportunity and how risky is it to invest in the current version?

They are **not**:

-   a forecast
-   a statistically calibrated probability
-   an investor recommendation
-   a guarantee of market success

## Competition

The system prompt defines the competition factor as:

> how difficult it is to compete successfully

Therefore stronger competition should reduce viability.

## Verdicts

The backend model can return:

### DON'T KILL IT

The available evidence is strong enough to justify further validation.

### NOT YET

There may be an opportunity, but important assumptions remain
unresolved.

### KILL IT

The evidence does not justify significant investment in the current
form.

## Demo scoring

The frontend contains deterministic demo analyses. Its local helper
uses:

``` text
70–100  DON'T KILL IT
50–69   WORTH EXPLORING
0–49    KILL IT
```

This thresholding applies to the deterministic demo engine and UI
helpers. It should not be confused with a statistical model.

## Confidence

The backend confidence values are:

-   `High`
-   `Medium`
-   `Low`

The frontend maps these to presentation percentages for the UI.

Those percentages are presentation values, not calibrated probabilities.

## Why no weighted formula?

A fixed weighted formula would create false precision.

The project instead asks the LLM to reason across the factors while
enforcing:

-   valid ranges
-   required fields
-   evidence constraints
-   improvement constraints
-   citation constraints

This is intentionally transparent about the limits of the approach.

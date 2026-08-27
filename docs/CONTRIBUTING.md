# Contributing

Thanks for contributing to KillMyIdea.

## Before opening a pull request

Please:

1.  Explain the problem being solved.
2.  Keep changes focused.
3.  Avoid adding speculative features.
4.  Add or update tests when behavior changes.
5.  Never include secrets.
6.  Update documentation when public behavior changes.

## Development

Backend:

``` bash
cd backend
pytest
```

Frontend:

``` bash
cd frontend
yarn test
yarn build
```

## Pull request checklist

-   [ ] The change has a clear purpose.
-   [ ] Existing behavior is preserved where possible.
-   [ ] Tests pass.
-   [ ] No API keys or credentials are included.
-   [ ] Documentation is updated when necessary.
-   [ ] The change does not introduce fabricated evidence or citations.

## Product philosophy

KillMyIdea is intentionally skeptical.

A contribution should not make the analysis "nicer" by hiding
uncertainty.

Prefer:

> Insufficient evidence.

over:

> A confident guess.

The core principle is:

> **Evidence over assumptions.**

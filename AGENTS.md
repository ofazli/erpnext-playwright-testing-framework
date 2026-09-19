# AGENTS.md

## Project purpose

This repository is a Playwright and TypeScript testing framework for ERPNext.
It contains UI tests, API tests, reusable page objects, API clients, typed
models, payload builders, and a Docker-based local ERPNext environment.

## Repository map

- `api/`: API clients, request/response models, templates, builders, and API utilities.
- `tests/api/`: ERPNext API tests.
- `tests/ui/`: browser-based UI tests.
- `pages/`: Playwright page objects.
- `fixtures/`: shared Playwright fixtures, including authenticated API fixtures.
- `chart/`: Mermaid flow charts documenting important test flows.
- `docs/`: English project and API documentation.
- `test-data/`: reusable test data.
- `compose.dev.yaml`: local ERPNext/Frappe development environment.

## General working rules

1. Inspect the existing implementation before changing it. Preserve the current architecture and naming conventions unless the task explicitly requests a refactor.
2. Keep API and UI responsibilities separate. API tests should use API clients and API fixtures; UI tests should use page objects and UI fixtures.
3. Use TypeScript types for request payloads and response bodies. Do not use untyped `any` when an existing model can be reused or extended.
4. Use builders for generated test data. Avoid hard-coded entity names when a test can run more than once.
5. Keep secrets and environment-specific credentials in `.env`; never commit real credentials or tokens.
6. When behavior or architecture changes, update the relevant documentation and Mermaid chart.
7. After code changes, run the narrowest relevant test first. Run `npx tsc --noEmit` when TypeScript files or types change.
8. Do not modify unrelated existing work in the working tree.

## API-specific rules

The detailed API rules are in `api/AGENTS.md`. Read and follow those rules for
any work involving API clients, API fixtures, API models, builders, templates,
or tests under `tests/api/`.


# Architecture Decision 001: Use a Monorepo

## Status

Accepted.

## Context

This project is a small full-stack technical assessment. Its features will commonly require coordinated changes to the Angular frontend, ASP.NET Core backend, tests and project documentation. The complete implementation must also be straightforward to develop, review and submit.

Frontend and backend deployment may eventually use independent processes, but no current requirement makes separate source repositories necessary.

## Decision

Use one Git repository for the Angular frontend, ASP.NET Core backend, tests and project documentation.

## Reasoning

A monorepo keeps related changes together and provides reviewers with one coherent history and submission. It also simplifies local coordination of API contracts, integration changes, verification and documentation. This is proportional to the project's size and avoids repository-management overhead that would not currently improve the assessment.

## Alternatives Considered

- **Separate frontend and backend repositories:** Provides stronger repository-level separation and can support independent ownership or release processes, but adds coordination, versioning and submission overhead without a current need.
- **Separate repositories plus a coordinating repository:** Could centralize cross-project instructions while retaining independent repositories, but introduces additional repository and dependency management that is unnecessary for this assessment.

## Consequences

### Positive

- Frontend, backend, tests and documentation can evolve in one coordinated change.
- API contract changes are easier to review alongside their consumers and verification.
- Local development, technical review and assessment submission use a single repository.
- Shared project-level documentation remains close to the implementation.

### Trade-offs

- Repository tooling must account for more than one technology ecosystem.
- Frontend and backend changes share one history even when they could be released independently.
- Build and automation boundaries must remain clear as the repository grows.

## Revisit Criteria

Reconsider this decision if frontend and backend gain independent teams, access controls, release cadences or lifecycle requirements that create material coordination or operational costs in a monorepo. Independent deployment alone is not sufficient reason to split the repository.

# Architecture Decision 006: Use SQLite In-Memory for Persistence Tests

## Status

Accepted.

## Context

The application needs automated tests for code that uses EF Core and, beginning with persistent users, a relational database. Production and normal local development use SQL Server, but requiring a SQL Server instance for the normal automated test suite would add infrastructure cost and friction.

EF Core's InMemory provider was considered, but it is not relational and can differ from relational providers in constraints, transactions and query behavior. The normal persistence test suite should remain fast and isolated while exercising meaningful relational behavior.

## Decision

Use the real SQLite EF Core provider with an in-memory SQLite database for normal automated persistence and integration tests.

Production and normal local development continue to use SQL Server. Tests configure the same `ApplicationDbContext` with SQLite instead of SQL Server and keep each test or test fixture appropriately isolated. Exercise actual EF Core behavior through the DbContext rather than mocking `DbSet`, adding repository abstractions for testing, or using `Microsoft.EntityFrameworkCore.InMemory` for normal persistence tests.

SQLite is not treated as equivalent to SQL Server. Behavior that depends on SQL Server-specific SQL, types, functions or semantics may require separate SQL Server-backed verification if introduced later.

## Reasoning

SQLite in-memory tests need no external database service and run quickly while preserving substantially more relational behavior than EF Core's InMemory provider. Swapping only the provider allows tests to exercise the same DbContext and EF Core application code used by the application without introducing test-driven persistence abstractions.

This is proportional to the assessment: the normal suite stays easy to run, while known provider differences remain explicit rather than being mistaken for production equivalence.

## Alternatives Considered

- **EF Core InMemory provider:** Easy to configure, but it is not relational and does not provide representative relational constraints, transactions or query behavior.
- **SQL Server for every persistence test, including container-based approaches:** Provides the closest production fidelity, but adds startup time, infrastructure requirements and test-suite friction that are disproportionate for the normal suite. It remains an option for targeted SQL Server-specific verification.
- **Mocking EF Core or repository abstractions:** Can isolate callers, but does not verify real EF Core queries or relational behavior. Introducing repositories solely to enable mocking would add unnecessary abstraction.

## Consequences

### Positive

- Persistence tests can run quickly without an external SQL Server dependency.
- Tests exercise relational constraints and query behavior more realistically than with EF Core InMemory.
- The same `ApplicationDbContext` and EF Core application code can be exercised.
- Isolated in-memory databases reduce state leakage between tests.

### Trade-offs

- SQLite is not SQL Server, so provider-specific behavior can differ.
- SQL Server-specific SQL, types, functions or semantics are not fully verified by the normal SQLite suite.
- Provider configuration and database lifetime must be managed carefully to preserve test isolation.
- Targeted SQL Server-backed tests may become necessary if provider-specific behavior is introduced.

## Revisit Criteria

Reconsider this decision if SQL Server-specific behavior becomes significant, SQLite provider differences cause misleading results, the normal suite requires production-provider fidelity, or containerized SQL Server tests become sufficiently low-friction to justify broader use.

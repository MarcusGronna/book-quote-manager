# Architecture Decision 003: Use SQL Server and EF Core for Persistence

## Status

Accepted.

## Context

The application requires relational persistence for users, books, quotes and their ownership relationships. It is intended to deploy primarily to Microsoft Azure with minimal operating cost, while local database development will use Docker.

## Decision

Use the following persistence stack:

```text
Local development: SQL Server in Docker
Data access:       Entity Framework Core with the Microsoft SQL Server provider
Production:        Azure SQL Database
```

Use EF Core migrations and commit migrations to source control. Do not introduce a custom generic repository abstraction over EF Core unless implementation demonstrates a concrete need.

The initial relational model will include user-owned Books and Quotes. Detailed schemas, relationships and constraints belong to their implementation slices rather than this decision.

## Reasoning

Azure SQL Database integrates naturally with ASP.NET Core, EF Core and an Azure-first deployment. Running SQL Server locally reduces provider differences between development and production. Azure SQL currently offers a suitable low-cost/free serverless option for a very small assessment application, while relational storage fits users, books, quotes and their ownership relationships.

EF Core is the natural ORM for this .NET application and provides change tracking, relational mapping and migrations without requiring manual data-access infrastructure. Cost and Azure-native hosting are important factors, but pricing and free-tier conditions can change and must be checked again before deployment.

## Alternatives Considered

- **PostgreSQL locally with Azure Database for PostgreSQL:** Technically suitable and relational, but less aligned than Azure SQL with the current Azure-first, low-cost deployment goal.
- **PostgreSQL with an external provider such as Neon:** Can provide an attractive hosted option, but introduces an additional provider relationship outside the intended Azure deployment path.
- **SQLite:** Simple and inexpensive locally, but differs more materially from the intended production database and is less representative of the deployed environment.
- **Direct ADO.NET or manual SQL:** Provides maximum query control, but adds data-access and mapping work that EF Core already handles effectively for this assessment.

## Consequences

### Positive

- Local and production environments use the same database family.
- EF Core supplies established mapping, change tracking and migration tooling.
- Relational constraints can represent user ownership and book/quote relationships.
- The stack aligns with the intended Azure deployment.

### Trade-offs

- Local development requires Docker and a SQL Server container.
- EF Core behavior, generated queries and migrations still require review and understanding.
- Azure pricing, free-tier eligibility and operational limits must be monitored.
- The application becomes coupled to SQL Server-specific provider behavior where such features are used.

## Revisit Criteria

Reconsider this decision if Azure SQL free or low-cost availability changes materially, deployment moves away from Azure, a PostgreSQL-specific capability becomes necessary, or operational or cost requirements materially change.

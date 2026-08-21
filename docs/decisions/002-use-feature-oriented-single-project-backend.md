# Architecture Decision 002: Use a Feature-Oriented Single-Project Backend

## Status

Accepted.

## Context

The backend is a small ASP.NET Core .NET 9 REST API covering authentication, books, quotes, user-owned persistence, validation and authorization. The HTTP boundary will use Controllers.

A multi-project Clean Architecture structure with separate `Api`, `Application`, `Domain` and `Infrastructure` assemblies was considered. At the current scale, it would add interfaces, project references, mappings and structural ceremony before those boundaries provide meaningful value.

## Decision

Use one ASP.NET Core application project, `BookQuoteManager.Api`, and one separate backend test project, `BookQuoteManager.Api.Tests`. Organize the API project by feature and use Controllers as its HTTP boundary.

The intended high-level structure is approximately:

```text
BookQuoteManager.Api/
├── Features/
│   ├── Auth/
│   ├── Books/
│   └── Quotes/
├── Data/
├── Common/
└── Program.cs
```

Exact subfolders will emerge only when implementation requires them. Preserve this responsibility flow inside the project:

```text
HTTP / Controller
        ↓
application behavior / service
        ↓
persistence
```

API DTOs and persistence entities remain conceptually separate. Do not add repository abstractions, mediator frameworks, CQRS infrastructure or separate Domain/Application/Infrastructure assemblies without a concrete requirement.

## Reasoning

This structure preserves important Clean Architecture principles—clear ownership, dependency direction and separation of transport, behavior and persistence—without imposing multi-project complexity on a small assessment. A single-project ASP.NET Core API is a professional choice when responsibilities remain coherent and testable; assembly count is not a measure of architectural quality.

## Alternatives Considered

- **Full multi-project Clean Architecture:** Provides compile-time dependency enforcement and stronger physical separation, but creates disproportionate ceremony for the current domain and team size.
- **Minimal APIs:** Offer a concise HTTP model, but Controllers better match the accepted organization for this API and provide an explicit boundary for its grouped CRUD and authentication behavior.
- **Traditional layer-based folders only:** Clearly groups technical roles, but can scatter each feature across the project and make feature-level navigation and change review less direct.

## Consequences

### Positive

- Related feature code remains easy to find and change together.
- Responsibility boundaries can stay explicit without cross-project plumbing.
- The backend remains approachable for implementation and technical review.
- A separate test project preserves a clear verification boundary.

### Trade-offs

- Dependency boundaries rely more on discipline and tests than assembly references.
- Shared concerns require care to avoid an unstructured `Common` folder.
- Features may need extraction if the application grows substantially.

## Revisit Criteria

Reconsider separate assemblies if domain complexity grows substantially, infrastructure needs interchangeable implementations, independent modules emerge, dependency boundaries need compile-time enforcement, or the project grows beyond this assessment's scope.

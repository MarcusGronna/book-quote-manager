# Slice 1: Book Library Viewer

## Status

Complete

## Goal

Allow a user to open the Angular application and view a list of books supplied by the ASP.NET Core REST API.

This is the smallest useful end-to-end full-stack flow. It proves basic frontend/backend integration before persistence, authentication or write operations are introduced.

## User Story

As a user,  
I want to view the books available in the application,  
so that I can see the current book collection.

## Expected Flow

```text
Angular /books
      |
      | GET /api/books
      v
ASP.NET Core API
      |
      v
temporary seeded/in-memory book data
```

## Book Response Shape

Each returned book contains only:

- `id`
- `title`
- `author`
- `publishedDate`

Exact implementation types and domain modeling beyond this response contract will be decided when required. The slice must not introduce a more elaborate domain model without a demonstrated need.

## API Contract

```http
GET /api/books
```

A successful request returns:

```http
200 OK
Content-Type: application/json
```

The response body is a JSON array of books using the minimal response shape above. Endpoint implementation style is intentionally not specified.

Example response conforming to this documented contract (not implemented runtime output):

```json
[
  {
    "id": 1,
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "publishedDate": "2008-08-01"
  }
]
```

## Frontend

The first frontend route is:

```text
/books
```

The page:

- requests books from the ASP.NET Core API;
- renders each returned book's title, author and publication date;
- presents a reasonable loading state where the request is not yet complete;
- presents a reasonable user-facing state when the request fails.

No additional book routes are introduced unless implementation reveals a real requirement.

## In Scope

- Scaffold the Angular 20 frontend when implementation begins.
- Scaffold the ASP.NET Core .NET 9 backend when implementation begins.
- Establish Angular-to-ASP.NET Core REST communication.
- Implement `GET /api/books`.
- Supply a few temporary seeded or in-memory books.
- Add the Angular `/books` view.
- Render book title, author and publication date.
- Add basic backend verification or tests for the API behavior.
- Update README local run instructions after implementation exists.

## Out of Scope

- Database persistence
- Entity Framework Core or another ORM
- Registration
- Login
- JWT authentication
- Authorization
- Creating books
- Editing books
- Deleting books
- Quote functionality
- Search
- Pagination
- Dark mode
- Significant UI polish
- Production deployment

These are temporary implementation boundaries for this slice, not removals from the assessment's broader requirements.

## Acceptance Criteria

- ASP.NET Core exposes `GET /api/books`.
- The endpoint returns `200 OK` for a successful request.
- The response is a JSON array whose books contain `id`, `title`, `author` and `publishedDate`.
- Angular exposes a `/books` page.
- Angular obtains book data from the ASP.NET Core API rather than duplicating it locally.
- Returned books are rendered in the browser with title, author and publication date.
- A failed API request produces a reasonable user-facing state.
- Basic backend verification or tests for the API behavior pass.
- No persistence, authentication, authorization or write operations are introduced.

## Definition of Done

- The backend starts successfully.
- The frontend starts successfully.
- `GET /api/books` satisfies the documented API contract.
- The `/books` page successfully obtains and renders data from the backend.
- Relevant tests, builds and integration checks pass.
- README contains correct local run instructions for both applications.
- The implementation remains limited to this slice.

## Decisions Deferred

### Implemented in Slice 1

- [ADR 002](../decisions/002-use-feature-oriented-single-project-backend.md) is reflected by the single ASP.NET Core API project, separate backend test project, Controllers and feature-oriented Books organization.

### Accepted for Later Slices

- [ADR 003](../decisions/003-use-sql-server-and-ef-core-for-persistence.md) establishes SQL Server and EF Core for application persistence, while [ADR 006](../decisions/006-use-sqlite-in-memory-for-persistence-tests.md) establishes SQLite in-memory for normal automated persistence tests. Slice 1 implemented neither because it intentionally used temporary backend-owned book data.
- [ADR 004](../decisions/004-use-identitycore-and-jwt-bearer-authentication.md) establishes IdentityCore and JWT Bearer authentication, and [ADR 005](../decisions/005-store-jwt-access-token-in-local-storage.md) establishes browser `localStorage` for JWT access-token storage. Authentication and token handling remained outside Slice 1.

These decisions were accepted for the overall application even though their functionality remained outside this slice.

### Still Deferred After Slice 1

- Production deployment details.
- Persistence schemas, JWT configuration and testing details not settled by the accepted ADRs or Slice 1 verification.

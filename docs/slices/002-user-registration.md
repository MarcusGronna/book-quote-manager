# Slice 2: User Registration

## Status

Planned

## Goal

Allow a user to create a persistent account from the Angular application through the ASP.NET Core REST API.

This is the smallest useful end-to-end slice that introduces application persistence, EF Core, SQL Server, IdentityCore and registration. It does not authenticate the newly registered user or introduce login or JWT behavior.

## User Story

As a new user,  
I want to register with a username and password,  
so that I have a persistent account I can use to log in later.

## End-to-End Flow

Normal local application flow:

```text
Angular /register
        |
        | username + password
        | POST /api/auth/register
        v
ASP.NET Core Auth Controller
        |
        v
IdentityCore / UserManager
        |
        v
ApplicationDbContext
        |
        v
EF Core SQL Server provider
        |
        v
SQL Server in Docker
```

Automated persistence/integration test flow:

```text
xUnit / WebApplicationFactory
        |
        v
ASP.NET Core API
        |
        v
IdentityCore / ApplicationDbContext
        |
        v
EF Core SQLite provider
        |
        v
isolated SQLite in-memory database
```

SQL Server is the normal local-development and intended production persistence provider. SQLite in-memory replaces only the provider in automated persistence tests; application code continues to use the same `ApplicationDbContext`.

## Persistence and Identity Boundaries

- `ApplicationDbContext` provides the EF Core and Identity persistence boundary.
- A minimal application user type represents the persisted Identity user without speculative profile fields.
- IdentityCore and `UserManager` own username and password validation, password hashing and user creation.
- Application code must not hash passwords itself or persist plaintext passwords.
- API request and error contracts remain separate from Identity persistence types and internals.
- This slice creates the initial Identity schema only; Books and Quotes remain backed by the temporary Slice 1 data.

Use EF Core migrations and commit the initial migration to source control. Local SQL Server setup and configuration must be reproducible without committing database credentials or other secrets.

## API Contract

### Register User

```http
POST /api/auth/register
Content-Type: application/json
```

Minimum request body:

```json
{
  "username": "new-user",
  "password": "user-supplied-password"
}
```

The request does not contain a user ID or email. The server and IdentityCore determine the persisted user's identity.

### Successful Registration

When the request is valid and the username is available:

- IdentityCore validates the username and password;
- IdentityCore hashes the password;
- the new Identity user is persisted through `ApplicationDbContext`;
- the API returns an appropriate successful HTTP status;
- `201 Created` is the current preferred option because registration creates a user, but another suitable success status may be used if it produces a cleaner API contract without inventing a user lookup endpoint or `Location` URI;
- the response contains no unnecessary user or Identity data;
- no JWT is returned;
- the user is not automatically authenticated.

Registration creates an account only. Login and JWT issuance are separate future operations.

### Duplicate Username

A username that already exists returns `409 Conflict` with a useful ProblemDetails-style client error. The response must not expose Identity persistence internals or other sensitive implementation details.

### Invalid Registration Data

Malformed, missing or Identity-invalid registration data returns `400 Bad Request` using an appropriate validation or ProblemDetails-style response. Client-facing errors should identify actionable validation failures without exposing password data, hashes, database details or stack traces.

The exact error-code vocabulary and Identity password policy remain implementation details, but backend validation is authoritative. Angular validation improves usability and does not replace server-side validation.

## Frontend Behavior

The Angular route is:

```text
/register
```

The registration feature follows the existing frontend responsibility flow:

```text
/register route
        ↓
Registration page / standalone component
        ↓
Auth API service boundary
        ↓
HttpClient
        ↓
POST /api/auth/register
```

The page:

- uses a Reactive Form with username and password controls;
- reports obvious client-side validation failures before submission;
- delegates HTTP communication to a dedicated Auth API service;
- represents idle, submitting, success and server-error states clearly;
- maps backend validation errors to useful user-facing feedback;
- uses Bootstrap form styling and remains usable at mobile, tablet and desktop widths;
- does not store credentials beyond what is required to submit the form;
- does not create authentication state or store a token after registration.

Successful registration displays a clear account-created state. A login route is not introduced or targeted until the separate login slice exists.

Do not introduce NgRx or another global state-management framework. Local component state, including signals where useful, is sufficient for this flow.

## Development CORS

The existing development CORS policy currently permits the Angular development origin to perform `GET` requests. Slice 2 must expand it only as required for the JSON registration request:

- continue allowing only the explicit Angular development origin;
- allow `POST` in addition to the existing `GET` behavior;
- allow the JSON `Content-Type` request header required by registration;
- support the browser's resulting preflight request through the CORS middleware;
- do not use unrestricted `AllowAnyOrigin()`;
- do not allow the `Authorization` header merely for future JWT work.

CORS remains a browser boundary and is not authentication or authorization.

## Testing Strategy

Backend registration tests use `WebApplicationFactory` and SQLite in-memory under ADR 006. Each test or fixture receives appropriately isolated database state while the API continues to resolve the same `ApplicationDbContext` used by application code.

HTTP-level integration tests should exercise the valuable observable path:

```text
request
   ↓
routing and Auth Controller
   ↓
IdentityCore / UserManager
   ↓
ApplicationDbContext and EF Core
   ↓
SQLite in-memory
   ↓
HTTP response
```

Tests cover at least:

- successful registration returns the documented status and persists the user;
- the persisted password is not plaintext and Identity's public APIs, such as `UserManager` password verification, can successfully verify the supplied password for the created user;
- duplicate usernames are rejected without creating another user;
- missing or invalid registration data is rejected with an appropriate client response;
- successful registration does not return a JWT;
- database state does not leak between isolated tests.

Password tests should verify Identity's public behavior rather than the internal format of `PasswordHash`. They must not depend on hash prefixes, hash length, algorithm-specific formatting or other Identity implementation details.

Use the real SQLite EF Core provider. Do not use `Microsoft.EntityFrameworkCore.InMemory`, mock `DbSet`, or introduce repository abstractions solely for testing.

SQLite tests verify application behavior against a relational provider, not SQL Server equivalence. Any SQL Server-specific types, functions, SQL or semantics introduced later require separate provider-specific verification.

Frontend tests should cover behavior where it provides value, including validation state, preventing invalid submission, the valid request payload, submission state, success feedback and server-error feedback. They should mock the feature API boundary rather than make real network requests.

## In Scope

- Add the EF Core and Identity packages required for SQL Server persistence and IdentityCore integration when implementation begins.
- Add the SQLite EF Core provider to the backend test project when implementation begins.
- Introduce `ApplicationDbContext` and a minimal application user type.
- Configure IdentityCore and its EF Core stores.
- Configure SQL Server for normal local application development.
- Provide reproducible SQL Server Docker setup.
- Create and commit the initial EF Core migration and application schema.
- Add the feature-oriented Auth area and Controller endpoint.
- Implement `POST /api/auth/register` with an explicit request DTO.
- Handle successful registration, duplicate usernames and invalid registration data.
- Persist new users through IdentityCore without exposing Identity entities or password hashes.
- Add HTTP-level backend integration tests using isolated SQLite in-memory databases.
- Add the Angular `/register` route and standalone registration page.
- Use Reactive Forms for username and password input and validation.
- Add a dedicated frontend Auth API service for the registration request.
- Present submission, success and server-validation/error states.
- Expand development CORS only as required for the JSON registration POST.
- Preserve and reverify the temporary Books functionality from Slice 1.
- Update README setup and run instructions after the implementation exists.
- Update the assessment checklist only after implementation evidence supports marking requirements complete.

## Out of Scope

- Login
- JWT creation
- JWT validation
- Bearer authentication
- Browser `localStorage` token handling
- HTTP authentication interceptors
- Authorization
- Protecting Books endpoints
- Persistent Books
- Creating, editing or deleting Books
- Persistent Quotes
- Quote CRUD
- Seeding five Quotes
- Navigation between Books and Quotes
- Password reset
- Email collection or delivery
- Dark mode
- Production deployment
- Production Azure SQL configuration
- Unrelated UI polish

The temporary Books feature from Slice 1 may remain available and anonymous during this slice. It must not be distorted into an authenticated or persistent feature before login and JWT support exist.

## Acceptance Criteria

### Backend and Persistence

- SQL Server development persistence can be started and configured reproducibly.
- EF Core can create or migrate the application schema from the committed migration.
- The application uses SQL Server for normal local persistence.
- Identity users are persisted through `ApplicationDbContext`.
- `POST /api/auth/register` accepts a valid username and password and returns a documented, appropriate successful HTTP status; `201 Created` remains the current preference rather than a fixed requirement.
- A successful registration persists exactly one new Identity user.
- IdentityCore validates and hashes the password; no plaintext password is stored.
- A duplicate username is rejected with `409 Conflict` and a useful client-facing error.
- Missing or invalid registration data is rejected with `400 Bad Request` and useful validation details.
- Registration does not return a JWT and does not authenticate the user.
- Registration responses do not expose password hashes or Identity persistence internals.
- Existing `GET /api/books` behavior remains functional and temporary.

### Frontend

- Angular exposes a `/register` route.
- The page provides username and password controls using Reactive Forms.
- Obvious invalid form state is prevented from being submitted and is reported to the user.
- Submitting a valid form calls `POST /api/auth/register` through the Auth API service boundary.
- Submission progress and successful account creation are represented clearly.
- Duplicate-username and backend-validation errors are represented clearly.
- No token is stored and no authenticated client state is created.
- The form remains usable at relevant mobile, tablet and desktop viewport sizes.

### Testing and Verification

- Backend integration tests use isolated SQLite in-memory databases with the real SQLite EF Core provider and the application `ApplicationDbContext`.
- Tests verify successful persistence, password verification through Identity's public APIs without relying on `PasswordHash` formatting, duplicate usernames and invalid input.
- Backend build and automated tests pass.
- Frontend build and relevant frontend tests pass.
- Registration is manually verified end-to-end from Angular through the API to local SQL Server.
- Slice 1 Books behavior is reverified.

## Definition of Done

- The implementation matches the documented registration API contract.
- The initial database migration exists, is committed and can reproduce the schema.
- Local SQL Server setup is documented and reproducible.
- Backend and frontend build cleanly.
- Relevant backend and frontend automated tests pass.
- Registration works end-to-end from Angular to local SQL Server.
- IdentityCore owns password validation, hashing and persistence; no plaintext password is stored.
- Duplicate and invalid registration attempts produce useful client-facing responses.
- Login, JWT, token storage and authorization behavior have not leaked into the slice.
- Existing Slice 1 functionality still works.
- README setup and run instructions reflect the new database requirements after implementation.
- `docs/requirements/assessment-checklist.md` is updated only where completed behavior is supported by implementation evidence.
- The slice remains `Planned` until every acceptance criterion and Definition of Done item is verified.

## Decisions and Deferred Decisions

### Applied Decisions

- [ADR 002](../decisions/002-use-feature-oriented-single-project-backend.md) governs the Controller-based, feature-oriented API and separate test project.
- [ADR 003](../decisions/003-use-sql-server-and-ef-core-for-persistence.md) governs EF Core, SQL Server in Docker for normal local development and Azure SQL Database as the intended production database.
- [ADR 004](../decisions/004-use-identitycore-and-jwt-bearer-authentication.md) governs IdentityCore user and password handling while keeping login and JWT issuance separate.
- [ADR 005](../decisions/005-store-jwt-access-token-in-local-storage.md) remains accepted for a later authentication slice and is not implemented here.
- [ADR 006](../decisions/006-use-sqlite-in-memory-for-persistence-tests.md) governs isolated SQLite in-memory persistence tests using the application DbContext.

### Deferred Implementation Details

- The exact Identity password policy and its matching client-side guidance will be chosen during implementation and documented through configuration and tests.
- The Identity user key type and any future profile fields remain undecided; no extra user data should be added without a requirement.
- The exact SQL Server container image/tag and local orchestration details will be selected during implementation while keeping setup reproducible.
- Detailed ProblemDetails extension fields may emerge during implementation, while the documented error status codes and security boundaries remain fixed.
- Login UX, JWT claims and lifetimes, token storage behavior, authorization rules and production Azure SQL configuration belong to later slices.

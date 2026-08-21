# Architecture Decision 004: Use IdentityCore and JWT Bearer Authentication

## Status

Accepted.

## Context

The assessment requires registration, login, JWT authentication and protected CRUD operations. Users authenticate with a unique username and password, while Books and Quotes belong to individual users.

Passwords must never be stored directly or handled with custom password-hashing logic. Authentication must establish a server-trusted identity that authorization and ownership checks can use.

## Decision

Use ASP.NET Core IdentityCore for user management, password hashing, password verification and other security-sensitive credential handling. Use ASP.NET Core JWT Bearer authentication to authenticate API requests.

The initial flow is:

```text
Register
   ↓
account created

Login
   ↓
credentials verified by IdentityCore
   ↓
JWT access token issued
   ↓
Angular sends Authorization: Bearer <token>
   ↓
ASP.NET Core validates token
   ↓
protected endpoint executes
```

Registration and login endpoints are anonymous. Book and Quote CRUD endpoints require authentication. The backend determines resource ownership from the validated authenticated principal; it must never trust an arbitrary user ID supplied by the frontend to select an owner.

The access token must contain a stable authenticated-user identifier sufficient for the backend to resolve the current user. Exact claims will be chosen during implementation. Passwords, password hashes and unnecessary personal information must not be included.

Email-based password reset is a desired bonus outside the initial mandatory authentication implementation. If added later, use ASP.NET Core Identity token mechanisms rather than custom reset tokens; this decision does not select an email provider.

## Reasoning

IdentityCore provides established credential handling and avoids security risks from custom password storage and verification. JWT Bearer authentication matches the assessment's explicit JWT requirement and the Angular-to-REST-API boundary. Server-derived ownership ensures client input cannot impersonate another resource owner.

## Alternatives Considered

- **Custom password hashing and user management:** Offers full control, but recreates security-sensitive framework functionality and creates unacceptable implementation risk.
- **Cookie-based server authentication:** Can be appropriate for browser applications, but does not directly match the assessment's required bearer JWT flow.
- **Third-party identity provider:** Can reduce local credential responsibilities, but adds external configuration and operational scope beyond the current assessment requirements.

## Consequences

### Positive

- Password handling relies on maintained framework mechanisms.
- The API has a standard bearer-token authentication boundary.
- Authorization and ownership checks derive from a validated server-side principal.
- Authentication responsibilities remain separate from Book and Quote behavior.

### Trade-offs

- JWT issuance, signing, validation, expiration and configuration must be implemented and tested carefully.
- Authorization and ownership rules must be applied consistently to protected endpoints.
- Token invalidation and session lifecycle are less immediate than with server-held sessions.
- IdentityCore introduces its required persistence model and configuration.

## Revisit Criteria

Reconsider this decision if authentication moves to Microsoft Entra ID or another identity provider, the application becomes browser-only and cookie authentication becomes preferable, or refresh tokens or multiple client types become requirements.

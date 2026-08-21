# Architecture Decision 005: Store the JWT Access Token in localStorage

## Status

Accepted.

## Context

The Angular client-side SPA needs to retain its JWT access token across navigation and page reloads. The assessment permits local storage or cookies, and the application uses Bearer authentication rather than cookie authentication.

## Decision

Store the JWT access token in browser `localStorage`.

During later implementation, a dedicated Angular authentication service will own authentication state and an HTTP interceptor will attach the token to protected API requests:

```http
Authorization: Bearer <token>
```

Do not implement this behavior as part of this ADR. Do not introduce refresh tokens at this stage.

## Reasoning

`localStorage` provides simple persistence across navigation and page reloads and fits the assessment's explicit Bearer-token flow. This is a deliberate, assessment-proportional trade-off, not a claim that `localStorage` is the most secure general-purpose token storage mechanism.

`localStorage` is accessible to JavaScript, so an XSS vulnerability could expose the token. Angular's normal output escaping and safe DOM practices therefore remain important. Application code must not insert untrusted HTML or bypass Angular sanitization without a justified reason. Tokens, secrets and credentials must not be logged unnecessarily, and short-lived access tokens are preferable to long-lived bearer credentials.

## Alternatives Considered

- **HttpOnly Secure SameSite cookies:** Reduce direct JavaScript access to the token, but require a different authentication design involving cookie behavior, CSRF considerations and cross-origin configuration.
- **In-memory-only token storage:** Avoids persistent browser storage, but loses authentication state on page reload and provides a poorer fit for the required user experience without an additional renewal mechanism.

## Consequences

### Positive

- Authentication state survives route changes and page reloads.
- Bearer tokens can be attached consistently through a dedicated interceptor.
- The client-side implementation remains small and understandable for the assessment.

### Trade-offs

- Any successful XSS attack could read and exfiltrate the access token.
- Secure DOM handling, dependency hygiene and short token lifetimes become especially important.
- Logout must remove the locally stored token, while expiration and invalid-token behavior require explicit handling.
- Refresh-token-based renewal is unavailable unless designed later.

## Revisit Criteria

Reconsider `localStorage` if security requirements increase, the application handles sensitive production data, refresh tokens are introduced, cookie-based authentication becomes practical, or deployment changes alter the security trade-off.

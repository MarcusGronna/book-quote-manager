# Project Roadmap

This roadmap describes the current intended direction for Book Quote Manager. It is deliberately lightweight and provisional: detailed behavior belongs in the active slice document, while architecture and completed assessment requirements are tracked separately.

## Planned Slice Sequence

| Slice | Goal | Status |
|---|---|---|
| 1. [Book Library Viewer](slices/001-book-library-viewer.md) | Prove the Angular → REST API → ASP.NET Core end-to-end flow. | Complete |
| 2. [User Registration](slices/002-user-registration.md) | Add SQL Server/EF Core persistence, IdentityCore and persistent account registration. | Planned |
| 3. Login and JWT Authentication | Add login, backend-issued JWT access tokens, frontend token handling, authenticated requests and protected API access. | Planned |
| 4. Book CRUD | Add persistent user-owned Books with create, edit and delete flows. | Planned |
| 5. My Quotes CRUD | Add persistent user-owned Quotes, five initial favorite quotes and create/edit/delete behavior. | Planned |
| 6. Application UX | Complete Books/Quotes navigation, responsive behavior, collapsing mobile navigation, Font Awesome usage and light/dark theme. | Planned |
| 7. Production and Submission | Deploy the frontend, API and database; complete production configuration, final verification, documentation and submission readiness. | Planned |

## Planning Approach

The sequence is provisional. It may change when implementation reveals new requirements, constraints or a better order of work.

After each slice:

1. Implementation is completed.
2. Automated and manual verification is completed.
3. Relevant documentation and the assessment checklist are updated.
4. The slice is merged to `main`.
5. The new `main` branch is reviewed.
6. The next slice is designed in detail.

Completed slice documents remain as implementation records. Only the current slice is planned in detail; future slices stay at roadmap level until the preceding slice is complete, verified and merged.

## Documentation Responsibilities

- `docs/roadmap.md` answers: **Where are we going?**
- `docs/slices/` answers: **What exactly are we building in the current slice?**
- `docs/requirements/assessment-checklist.md` answers: **Which assessment requirements have actually been satisfied?**
- `docs/decisions/` answers: **Which architectural decisions have been accepted and why?**

These documents should reference one another where useful without duplicating detailed contracts, acceptance criteria or architectural reasoning.

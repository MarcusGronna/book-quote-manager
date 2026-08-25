# Technical Assessment Requirements Checklist

This checklist tracks demonstrated repository functionality. An accepted architecture decision does not mark its future implementation complete.

## Technology

- [x] Angular 20 frontend.
- [x] ASP.NET Core .NET 9 backend using C#.
- [x] REST communication between Angular and ASP.NET Core.
- [ ] SQL Server and EF Core application persistence.
- [ ] JWT authentication.

## Books CRUD

- [x] Display books obtained from the backend REST API.
- [ ] Add a book through a form and return to the book list after success.
- [ ] Open an existing book in a pre-populated edit form and return to the book list after success.
- [ ] Delete a book and reflect the deletion in the book list.
- [ ] Protect Book CRUD and limit data access to the authenticated owner.

## Authentication and JWT

- [ ] Register a user with a unique username and password persisted through IdentityCore.
- [ ] Direct the user to login after registration without automatically authenticating them or issuing a JWT.
- [ ] Log in with valid credentials.
- [ ] Generate the JWT access token in the backend after successful login.
- [ ] Store the access token in browser `localStorage`.
- [ ] Send the access token as a Bearer token to protected API endpoints.
- [ ] Derive resource ownership from the authenticated principal rather than a client-supplied user ID.

## My Quotes

- [ ] Provide five initial favorite quotes for a newly registered user.
- [ ] Display the authenticated user's quotes.
- [ ] Create quotes and display newly created quotes newest-first.
- [ ] Edit an existing quote.
- [ ] Delete an existing quote.
- [ ] Protect Quote CRUD and limit data access to the authenticated owner.

## Navigation and Responsive Design

- [x] Provide the Angular `/books` route.
- [ ] Provide navigation between Books and My Quotes.
- [ ] Support usable mobile, tablet and desktop layouts across the completed application.
- [ ] Collapse navigation appropriately on smaller screens.

## Bootstrap and Font Awesome

- [x] Install and configure Bootstrap through npm.
- [x] Use Bootstrap in the implemented Books interface.
- [x] Install and configure Font Awesome through npm.
- [ ] Use Font Awesome icons in the application interface.

## Additional Challenge

- [ ] Provide an optional light/dark theme.

## Deployment / Submission

- [ ] Deploy the completed application.
- [x] Maintain the source in a GitHub repository.
- [ ] Provide the deployed application and GitHub repository links for submission.

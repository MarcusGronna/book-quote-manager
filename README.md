# Book Quote Manager

Book Quote Manager is a full-stack technical internship assessment built with Angular and ASP.NET Core. The current implementation contains the first end-to-end slice: viewing books supplied by the backend in the Angular application.

## Technology Stack

- Angular 20
- ASP.NET Core on .NET 9
- C#
- REST API
- JWT authentication (planned)
- Bootstrap
- Font Awesome

## Current Functionality

Slice 1 — Book Library Viewer provides:

- `GET /api/books` from the ASP.NET Core API;
- temporary backend-owned in-memory book data;
- an Angular `/books` page;
- responsive book rendering;
- loading and request-failure states;
- backend API integration tests;
- frontend component behavior tests.

Persistence, authentication, write operations and quote functionality are planned for later slices.

## Planned Scope

- User registration and login
- JWT-based authentication
- Book create, read, update and delete operations
- Quote create, read, update and delete operations
- Responsive navigation between books and quotes
- Dark mode
- Deployment

## Repository Structure

```text
backend/
├── BookQuoteManager.sln
├── src/
│   └── BookQuoteManager.Api/
└── tests/
    └── BookQuoteManager.Api.Tests/

frontend/
├── src/
└── package.json

docs/
├── decisions/
└── slices/

global.json
README.md
```

## Getting Started

### Prerequisites

- .NET 9 SDK
- Node.js and npm
- A trusted ASP.NET Core HTTPS development certificate

### Backend

From the repository root:

```bash
cd backend
dotnet run --project src/BookQuoteManager.Api --launch-profile https
```

The API runs at `https://localhost:7175`. The books endpoint is available at `https://localhost:7175/api/books`.

### Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:4200/books`. Both applications must be running for the page to load books.

## Testing and Builds

Backend:

```bash
cd backend
dotnet build
dotnet test
```

Frontend:

```bash
cd frontend
npm run build
npm test -- --watch=false --browsers=ChromeHeadless
```

## Architecture

Accepted architecture decisions are documented in [`docs/decisions`](docs/decisions). Implementation slices are documented in [`docs/slices`](docs/slices).

# NestJS + Keycloak Todo API

A NestJS REST API secured with Keycloak JWT authentication and role-based access control. Todos are owner-scoped and stored in PostgreSQL via Drizzle ORM.

## Features

- Keycloak JWT validation via Passport + JWKS
- Role-based authorization (`RolesGuard` + `@Roles`)
- Owner-scoped CRUD for todos
- Global request validation (`ValidationPipe` with whitelist + `forbidNonWhitelisted`)
- PostgreSQL + Drizzle ORM

## Stack

| Layer | Tech |
|-------|------|
| Framework | NestJS + TypeScript |
| Auth | Keycloak, Passport JWT, JWKS |
| Database | PostgreSQL |
| ORM | Drizzle |
| Validation | class-validator + class-transformer |

## Prerequisites

- Node.js 18+
- PostgreSQL
- A running Keycloak realm with a client that issues JWTs

## Setup

```bash
npm install
```

Create a `.env` file in the project root:

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/nest_keycloak
KEYCLOAK_JWKS_URI=http://localhost:8080/realms/your-realm/protocol/openid-connect/certs
```

### Database

```bash
# generate migrations (after schema changes)
npm run db:generate

# apply migrations
npm run db:migrate

# optional: open Drizzle Studio
npm run db:studio
```

### Run

```bash
# development (watch)
npm run start:dev

# production
npm run build
npm run start:prod
```

The API listens on `http://localhost:3000` by default.

## Auth

All `/todos` routes require a Bearer token from Keycloak:

```http
Authorization: Bearer <access_token>
```

The JWT is validated against Keycloak’s JWKS endpoint. The strategy maps:

- `sub` → `userId`
- `preferred_username` → `username`
- `email` → `email`
- `realm_access.roles` → `roles`

### Roles

`PATCH /todos/:id` requires the `admin` realm role. Assign it in Keycloak under **Realm roles**, then map it to the user.

## API

Base path: `/todos`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/todos` | JWT | Create a todo |
| `GET` | `/todos` | JWT | List current user’s todos |
| `GET` | `/todos/:id` | JWT | Get one todo (owner only) |
| `PATCH` | `/todos/:id` | JWT + `admin` | Update a todo |
| `DELETE` | `/todos/:id` | JWT | Delete a todo |

### Create body

```json
{
  "title": "Ship the API",
  "done": false
}
```

### Update body

```json
{
  "title": "Ship the API",
  "done": true
}
```

### Delete response

```json
{
  "deleted": true
}
```

## Project structure

```
src/
  auth/           # JWT strategy, auth guard, roles guard
  db/             # Drizzle schema + DB module
  todos/          # Todos controller, service, DTOs
  types/          # JWT / AuthUser types
  main.ts         # Bootstrap + global ValidationPipe
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run start:dev` | Start in watch mode |
| `npm run build` | Build for production |
| `npm run start:prod` | Run production build |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run migrations |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run test` | Unit tests |
| `npm run lint` | Lint + fix |

## License

UNLICENSED

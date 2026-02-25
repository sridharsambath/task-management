# Task Management API

A RESTful API for managing projects and tasks, built with Laravel 12 and PostgreSQL. Users can register, log in, and perform full CRUD on their own projects and tasks. Authentication is token-based (Laravel Sanctum).

## Prerequisites

- **Development with Docker:** Docker and Docker Compose
- **Development without Docker:** PHP 8.2+, Composer, PostgreSQL
- **Production:** PHP 8.2+ (e.g. PHP-FPM), PostgreSQL, reverse proxy (e.g. nginx)

## Development with Docker

1. Clone the repository and enter the project directory.
2. Copy the environment file and ensure `APP_KEY` is set (it will be generated on first run if missing):
   ```bash
   cp .env.example .env
   php artisan key:generate   # run once locally, or let the app container generate it on first up
   ```
3. Start the stack (PostgreSQL + Laravel app). The database is created with a **persistent volume** and **migrations run automatically** on first start:
   ```bash
   docker compose up --build
   ```
4. The API is available at **http://localhost:8000**. Database data persists in the `postgres_data` volume across `docker compose down`. To start with a fresh database, run `docker compose down -v` (removes volumes), then `docker compose up --build` again.

## Local Development (without Docker)

1. Clone the repository and install dependencies:
   ```bash
   composer install
   cp .env.example .env
   php artisan key:generate
   ```
2. Configure `.env` for your local PostgreSQL instance (`DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`).
3. Run migrations:
   ```bash
   php artisan migrate
   ```
4. Start the development server and run tests:
   ```bash
   php artisan serve
   php artisan test
   ```

## Code Style (PSR-12)

The project follows PSR-12. To check and fix style:

```bash
php artisan pint
```

Or inside the app container when using Docker:

```bash
docker compose exec app php artisan pint
```

## Running Tests

```bash
php artisan test
```

Feature tests cover registration, login, project and task CRUD, and authorization (users cannot access another user’s project).

## Production

- Build the production image from the Dockerfile (default target is `production`):
  ```bash
  docker build -t task-management-api .
  ```
- Run the container with environment variables set for `APP_KEY`, `DB_*`, `APP_ENV=production`, `APP_DEBUG=false`. The image runs PHP-FPM; serve it behind nginx (or another reverse proxy).
- Run migrations once before starting the app (e.g. as a one-off job or in your deployment pipeline):
  ```bash
  php artisan migrate --force
  ```

## API Overview

All responses are JSON. Base path: `/api`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register (name, email, password, password_confirmation). Returns token and user. |
| POST | `/api/login` | Login (email, password). Returns token and user. |
| GET | `/api/user` | Current user (requires `Authorization: Bearer <token>`). |
| GET | `/api/projects` | List current user’s projects. |
| POST | `/api/projects` | Create project (name, optional description). |
| GET | `/api/projects/{id}` | Show project. |
| PUT/PATCH | `/api/projects/{id}` | Update project. |
| DELETE | `/api/projects/{id}` | Delete project. |
| POST | `/api/projects/{project}/tasks` | Create task (title, description?, status, priority, due_date?, metadata?). |
| PUT/PATCH | `/api/projects/{project}/tasks/{task}` | Update task. |
| DELETE | `/api/projects/{project}/tasks/{task}` | Delete task. |

**Task `status`:** `todo`, `in_progress`, `done`.  
**Task `priority`:** `low`, `medium`, `high`.

Only the project owner can access (view/update/delete) that project and its tasks. Unauthorized access returns `403`; missing resources return `404`; validation errors return `422`.

## Assumptions

- One user has many projects; one project has many tasks; each task belongs to one project.
- Only the project owner can perform CRUD on that project and its tasks.
- Authentication is token-based (Sanctum); no session or “list all tasks across projects” endpoint.
- **PostgreSQL-specific features used:**
  - **JSONB** column `metadata` on `tasks` for flexible extra data.
  - **CHECK** constraints on `tasks.status` and `tasks.priority` (enforced in PostgreSQL; migrations skip these when using SQLite for tests).

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

# Move@Rokimania

FastAPI + Next.js app for tracking fitness stuff.

## Prerequisites

- Docker and Docker Compose

## Quick Start

### Using Docker Compose

1. Clone the repository and navigate to the project directory.
   <br/><br/>

2. Create `.env` file based on `example.env`:
   ```bash
   cp example.env .env
   ```

3. (Optional) Modify environment variables in `.env` as needed.
   <br/><br/>

4. Run the services (in detached mode):
   ```bash
   docker compose up -d --build
   ```

The applications will be available at:

- **Frontend**: [http://localhost:3000/](http://localhost:3000/)
- **Backend API**: [http://localhost:8000/](http://localhost:8000/)
- **Interactive API docs**:
  [http://localhost:8000/docs](http://localhost:8000/docs)
- **Alternative API docs**:
  [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Project Structure

- `backend/`: Contains the FastAPI application.
- `frontend/`: Contains the Next.js application.

## Development

The backend uses UV for dependency management inside the Docker container.
Dependencies are defined in `backend/pyproject.toml`.

To add new dependencies to the backend:

1. Add the dependency using UV in the running container:
   ```bash
   docker compose exec backend uv add package-name
   ```

2. For development dependencies:
   ```bash
   docker compose exec backend uv add --dev package-name
   ```

3. Restart the container to ensure the new dependencies are properly loaded:
   ```bash
   docker compose restart backend
   ```

The dependencies will be automatically installed when the container starts
thanks to the `uv sync` command in the startup process.

## Database Migrations

This project uses Alembic to manage database migrations.

### Generating a New Migration

When you make changes to the SQLAlchemy models (e.g., in
`backend/src/models.py`),
you need to generate a new migration script.

1. Run the following command to automatically generate a migration file:
   ```bash
   docker compose run --rm backend alembic revision --autogenerate -m "Your migration message"
   ```
   Replace `"Your migration message"` with a short, descriptive message about
   the changes.
   <br/><br/>
2. A new migration file will be created in `backend/alembic/versions/`.

### Applying Migrations

To apply the latest migrations to the database, run:

```bash
    docker compose run --rm backend alembic upgrade head
```

This command should be run after generating a new migration or when setting up
the project for the first time.

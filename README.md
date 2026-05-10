# lcm_track

## Local development (hot reload)

Run the dev stack:

```bash
docker compose up --build
```

Services:

- Frontend (Angular with hot reload): http://localhost
- Backend (Laravel API): http://localhost:8000
- MySQL: localhost:3306

This stack uses the MySQL container in Docker. You do not need MAMP for the database.

If this is your first run, execute migrations:

```bash
docker compose exec backend php artisan migrate
```

Stop the dev stack:

```bash
docker compose down
```

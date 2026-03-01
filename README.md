# Full-Stack URL Shortener

A production-ready URL shortener with a Spring Boot + PostgreSQL backend and a React frontend.

## Features
- Shorten long URLs with a 6-character alphanumeric code
- Redirects with click counting
- Stats endpoint (original URL, short code, created date, total clicks)
- React UI with copy-to-clipboard and stats view
- Dockerized setup (Postgres + API + UI)

## Tech Stack
- Backend: Java 17, Spring Boot 3, Spring Data JPA
- Database: PostgreSQL
- Frontend: React, React Router, Axios
- DevOps: Docker, docker-compose, Nginx

## Project Structure
- `backend/` Spring Boot API
- `frontend/` React UI
- `docker-compose.yml` Postgres + backend + frontend

## Run with Docker
```bash
docker compose up --build
```

App URLs:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`

## Local Development
Backend:
```bash
cd backend
mvn spring-boot:run
```

Frontend:
```bash
cd frontend
npm install
npm start
```

## API
### POST `/api/shorten`
```bash
curl -X POST http://localhost:8080/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl":"https://example.com"}'
```
Response:
```json
{"shortUrl":"http://localhost:8080/abc123"}
```

### GET `/{shortCode}`
```bash
curl -I http://localhost:8080/abc123
```
Redirects to the original URL and increments click count.

### GET `/api/stats/{shortCode}`
```bash
curl http://localhost:8080/api/stats/abc123
```
Response:
```json
{
  "originalUrl": "https://example.com",
  "shortCode": "abc123",
  "createdAt": "2026-03-01T12:34:56.789",
  "clickCount": 3
}
```

## CORS
CORS is configured to allow requests from `http://localhost:3000`.

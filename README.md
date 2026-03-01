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

## Screenshots

### Home
https://claude.ai/api/22da39ac-5637-4a9b-8056-0eba0368ecde/files/cb79dccd-283d-43ff-852a-6505496df8b4/preview<img width="1456" height="829" alt="image" src="https://github.com/user-attachments/assets/71df87c6-90cb-44d1-8ab9-e53a39030527" />


### Short Link Generated
https://claude.ai/api/22da39ac-5637-4a9b-8056-0eba0368ecde/files/b12d33d4-828c-4e59-ab3c-c951638e4274/preview<img width="1456" height="828" alt="image" src="https://github.com/user-attachments/assets/00768eca-0c69-481d-b97c-2db4ae07b902" />


### Stats
https://claude.ai/api/22da39ac-5637-4a9b-8056-0eba0368ecde/files/50207d7c-965a-4f73-a6b1-e5c4102af3b1/preview<img width="1456" height="838" alt="image" src="https://github.com/user-attachments/assets/87e1f663-3047-4695-8168-859a3a8be2bc" />


# Full-Stack URL Shortener

A production‑quality URL shortener with a Spring Boot + PostgreSQL backend and a modern React frontend. Create branded links, set expirations, generate QR codes, and track clicks with analytics.

## Features
- Custom short aliases with validation and conflict detection
- Expiring links (never, 24h, 7d, custom date/time)
- Redirects with click counting and daily click analytics
- QR code generation + download
- Recent links dashboard (last 10)
- Stats page with cards + chart
- Dark mode toggle, toast notifications, and polished UI

## Tech Stack
- Backend: Java 17, Spring Boot 3, Spring Data JPA
- Database: PostgreSQL
- Frontend: React, React Router, Axios
- UI: qrcode.react, recharts, react-hot-toast
- DevOps: Docker, docker-compose, Nginx

## Project Structure
- `backend/` Spring Boot API
- `frontend/` React UI
- `docker-compose.yml` Postgres + backend + frontend

## Run With Docker
```bash
docker compose up --build
```

App URLs:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080

## Local Development
### Prerequisites
- Java 17
- Maven
- Node.js 18+
- PostgreSQL 14+

### Database
```bash
createdb urlshortener
```

### Backend
```bash
cd backend
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Configuration
### Backend application.properties
Default database config is in:
`backend/src/main/resources/application.properties`

Key settings:
- `spring.datasource.url`
- `spring.datasource.username`
- `spring.datasource.password`
- `app.base-url`

`app.base-url` controls the returned short link base (and QR code target). Set this to your LAN IP or public domain for mobile scanning.

Example:
```
app.base-url=http://192.168.1.37:8080
```

### CORS
CORS is configured to allow `http://localhost:3000` in:
`backend/src/main/java/com/example/urlshortener/config/CorsConfig.java`

For production, add your frontend domain here.

## API Documentation
### POST `/api/shorten`
Request:
```bash
curl -X POST http://localhost:8080/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl":"https://example.com/long-path","customAlias":"myalias","expiresAt":"2026-03-15T10:30"}'
```

Notes:
- `customAlias` is optional.
- `expiresAt` is optional. Format: `YYYY-MM-DDTHH:mm`.

Response:
```json
{
  "shortUrl": "http://localhost:8080/myalias"
}
```

Error responses:
- `409` if alias already exists
- `400` for invalid input or past expiration

### GET `/{shortCode}`
```bash
curl -I http://localhost:8080/myalias
```

Behavior:
- Redirects to the original URL
- Increments click count
- Returns `410 Gone` if the link is expired

### GET `/api/stats/{shortCode}`
```bash
curl http://localhost:8080/api/stats/myalias
```

Response:
```json
{
  "originalUrl": "https://example.com/long-path",
  "shortCode": "myalias",
  "createdAt": "2026-03-01T12:34:56.789",
  "clickCount": 3,
  "dailyClicks": [
    { "date": "2026-03-13", "clicks": 1 },
    { "date": "2026-03-14", "clicks": 2 }
  ]
}
```

### GET `/api/links`
```bash
curl http://localhost:8080/api/links
```

Response:
```json
[
  {
    "originalUrl": "https://example.com/long-path",
    "shortCode": "myalias",
    "createdAt": "2026-03-01T12:34:56.789",
    "clickCount": 3
  }
]
```

## QR Codes On Mobile
The QR code contains the **short URL returned by the backend**. If it starts with `http://localhost:8080`, it will not work on your phone.

Fix:
- Set `app.base-url` to your LAN IP or public domain.
- Recreate the short link so the QR uses the new base URL.

## Deployment
### Backend (Recommended: Render/Railway/Fly.io/Heroku)
Set these environment variables in your host:
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `APP_BASE_URL` (public API URL for correct short links)

Build command:
```bash
mvn -DskipTests package
```

### Frontend (Netlify)
Netlify only hosts the React UI. Deploy the backend separately.

Build command:
```bash
npm run build
```

Publish directory:
```
build
```

Update API base URL in:
`frontend/src/api.js`

Set it to your backend domain:
```js
const API_BASE_URL = "https://your-backend-domain.com";
```

Add SPA redirect for React Router:
Create `frontend/public/_redirects` with:
```
/* /index.html 200
```

## Screenshots
Home (Idle state)

Home (After creation)

Stats page


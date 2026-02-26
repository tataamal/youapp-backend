# YouApp Backend (NestJS + MongoDB + RabbitMQ + Socket.io)

Backend features:

- Auth: Register / Login (JWT)
- Profile: Create / Get / Update profile (horoscope & zodiac otomatis dari birthday)
- Chat: Send message, View messages
- Notification: RabbitMQ consumer + realtime Socket.io events

---

## Tech Stack

- NestJS
- MongoDB (Mongoose)
- RabbitMQ (amqplib)
- Socket.io (realtime)
- Swagger (OpenAPI docs)
- Jest (unit tests)

---

## Prerequisites

- Node.js (LTS disarankan)
- Docker + Docker Compose
- Postman (testing HTTP)

---

## Environment

Konfigurasi environment sudah disiapkan lewat file `env.example`.
Silakan copy menjadi `.env` sesuai kebutuhan kamu.

---

## 1. Docker Services

```bash
docker compose up --build
docker compose down
docker compose down
docker compose up --build
docker compose logs -f api
docker compose logs -f mongo
docker compose logs -f rabbitmq
```

## 2. API Documentation (Swagger)

Swagger tersedia di:
http://localhost:3000/api-docs

Swagger memuat:

- Request body (params)
- Response schema
- Auth (Bearer JWT)

## 3. API Endpoints

Auth

- POST /api/register
- POST /api/login

Profile (JWT required)

- POST /api/createProfile
- GET /api/getProfile
- PUT /api/updateProfile

Chat (JWT required)

- POST /api/sendMessage
- GET /api/viewMessages

## 4. Realtime Notifications (Socket.io)

Konsep
Realtime dipakai untuk:

- Notifikasi receiver saat ada pesan masuk (message.received)
- Notifikasi sender bahwa pesan sudah delivered jika receiver online (message.delivered)

Flow :

1. Sender kirim message via HTTP POST /api/sendMessage
2. Backend simpan Message ke MongoDB
3. Backend publish event ke RabbitMQ queue (message.created)
4. Consumer (Notification module) consume event

```bash
Catatan: Realtime push terjadi otomatis setelah sendMessage. Frontend tidak perlu emit event socket untuk kirim chat. Autentikasi menggunakan tokon dari JWT
```

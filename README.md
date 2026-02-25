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

# 1) Local Development — Run with Docker Compose (Recommended)

## 1.1 Start services

```bash
docker compose up --build
```

# PulseTrace Ingestion API 📥

A high-performance Node.js/Express server built to ingest, process, and store telemetry data at scale.

## 🏗️ Technical Architecture

- **Express.js**: Lightweight HTTP server for handling ingestion requests.
- **BullMQ + Redis**: Asynchronous event processing queue to ensure high availability and low latency.
- **Prisma + PostgreSQL**: Type-safe data persistence for events and issues.
- **Worker System**: Background processing for PII scrubbing and error fingerprinting.

## 🚀 Setting Up

### Prerequisites
- Node.js v18+
- PostgreSQL
- Redis

### Installation

```bash
cd api
npm install
```

### Environment Variables
Create a `.env` file in the `api` root:
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/pulsetrace"
REDIS_URL="redis://localhost:6379"
PORT=3001
```

### Database Migration
```bash
npx prisma migrate dev --name init
```

## 📡 API Endpoints

### `POST /api/collect`
Ingest events from the SDK.
- **Header**: `x-api-key: <YOUR_PROJECT_API_KEY>`
- **Body**: Array of `PulseEvent` objects.
- **Response**: `202 Accepted`

### `GET /api/issues`
List aggregated issues for the dashboard.

## ⚙️ Background Processing
The API offloads processing to `workers/eventWorker.ts`. It performs:
1. **Fingerprinting**: Grouping similar errors via stack trace hashing.
2. **PII Scrubbing**: Redacting sensitive strings from breadcrumbs and messages.

## 🛡️ License
MIT

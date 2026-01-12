# 02 - Architecture

PulseTrace follows a modern N-tier architecture optimized for write-heavy telemetry workloads.

## 🏗️ System Components

```mermaid
graph TD
    subgraph Client_Side
        SDK[SDK Engine]
        Transport[Batching Transport]
    end

    subgraph Ingestion_Layer
        LB[Load Balancer]
        Express[Express API]
        RateLimiter[Redis Rate Limiter]
    end

    subgraph Processing_Pipeline
        Queue[BullMQ / Redis]
        Worker[Background Worker]
        Fingerprinter[Error Fingerprinter]
    end

    subgraph Persistence_Layer
        PG[(PostgreSQL)]
    end

    SDK --> Transport
    Transport --> LB
    LB --> Express
    Express --> RateLimiter
    Express --> Queue
    Queue --> Worker
    Worker --> Fingerprinter
    Worker --> PG
```

## 🏢 Architectural Layers

### 1. Ingestion Layer (Stateless)
- **Responsibility**: Validate API keys, rate-limit clients, and push events to the queue.
- **Tech**: Node.js, Express, ioredis.

### 2. Processing Layer (Asynchronous)
- **Responsibility**: Offload heavy computations (hashing, PII scrubbing) from the main thread.
- **Tech**: BullMQ, Redis.

### 3. Storage Layer
- **Responsibility**: Persistent storage of deduplicated issues and raw event metadata.
- **Tech**: PostgreSQL, Prisma.

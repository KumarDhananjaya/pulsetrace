# 10 - Tradeoffs

Every architectural decision in PulseTrace was a conscious choice between conflicting requirements.

## ⚖️ Tradeoff Matrix

| Feature | Chosen Path | Reason |
| --- | --- | --- |
| **Data Flow** | Asynchronous (Redis/BullMQ) | Reliability over immediate consistency. |
| **Storage** | Relational (PostgreSQL) | Strong consistency for Issue status management. |
| **SDK** | Zero Dependency | Maximum compatibility and minimal bundle size. |
| **Deduplication**| Stack Trace Hashing | High accuracy for grouping errors. |

## 🧠 Rationales

### Why not NoSQL?
While MongoDB could handle the scale, the relational nature of PulseTrace (Projects -> Issues -> Events) and the need for complex aggregations made PostgreSQL a more stable choice for the management dashboard.

### Why Batching?
PulseTrace prioritizes the user's network over real-time accuracy. By batching, we reduce the frequency of outgoing requests, which is crucial for mobile users and low-bandwidth clients.

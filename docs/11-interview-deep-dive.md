# 11 - Interview Deep-Dive: The "PulseTrace" Masterclass

This document is designed to help you explain PulseTrace during technical interviews. It covers the minute details, implementation "gotchas," and architectural rationales.

---

## 🏗️ 1. Why build PulseTrace (The "Problem")?
**The Answer**: Existing monitoring tools can be bloated. We wanted a **lightweight, high-throughput system** that provides 90% of Sentry's value with 10% of the overhead. The key challenges were **Reliability at the Edge (SDK)** and **Throughput at the Core (API)**.

## 🕵️ 2. SDK Deep Dive: Scaling the "Spy"

### Q: How do you catch errors without crashing the host app?
- **Global Listeners**: We use `window.onerror` and `window.onunhandledrejection`.
- **Defensive SDK**: Every SDK function is wrapped in internal `try-catch` blocks. If the SDK fails, it must fail silently to preserve the user application.
- **Monkeypatching**: We wrap `console.error` and `history.pushState`. This allows us to "tap" into existing streams without the developer manually calling us for every click.

### Q: How do you manage memory with Breadcrumbs?
- **Circular Buffer**: We don't just store an array of actions. We use a **Circular Buffer** with a fixed size (e.g., 20). 
- **The "Why"**: Storing unlimited actions would cause a memory leak in long-running Single Page Applications (SPAs).

### Q: How do you ensure data reaches the server during a page crash/close?
- **Navigator.sendBeacon**: When the user closes the tab or the page unloads, standard `fetch` requests are often cancelled. We use `sendBeacon` because it is specifically designed to send small amounts of data asynchronously to the server without delaying the page unload.

---

## 📥 3. API Deep Dive: High-Throughput Ingestion

### Q: Why use BullMQ and Redis? Why not write directly to the DB?
- **Instant Response**: Direct database writes take 50-200ms. By pushing events to Redis, we return `202 Accepted` in ~5ms. This is critical for high-traffic apps.
- **Decoupling**: If the database crashes or becomes slow, the API keeps working. The Redis queue acts as a "dam" that buffers the load until the workers can drain it.

### Q: How do you handle "Spammy" errors? (Deduplication)
- **Fingerprinting**: We hash the stack trace. 1,000 users hitting the same bug = 1,000 Events, but only **1 Issue**.
- **Normalization**: Before hashing, we "clean" the stack trace (remove memory addresses, variable line numbers in minified code) so that "similar" errors are grouped together.

---

## 📊 4. Data Model: Stability & Flexibility

### Q: Why Postgres instead of NoSQL?
- **Relations**: Monitoring is hierarchical (Project -> Issue -> Event). Postgres handles these joins with high performance using Foreign Keys.
- **ACID**: When we change an issue status (e.g., "Ignore"), we need it to be immediate and consistent across all workers.

### Q: Why JSONB?
- **Schema-less Parts**: Events contain device info, breadcrumbs, and extra context that varies wildly. `jsonb` gives us NoSQL-like flexibility inside a stable SQL environment.

---

## 🛠️ 5. Infrastructure & DevExp

### Q: How do you handle port conflicts?
- **Virtualization**: During development, we encountered a port 5432 conflict (local Postgres). We solved this by mapping the Docker host port to **5433**, showing an understanding of network abstraction.

### Q: Why Vite 6?
- **Modernity**: We encountered a dependency conflict with Tailwind 4 (which requires Vite 5+). We proactively upgraded to **Vite 6** to ensure our stack is cutting-edge.

---

## 🚀 Pro-Tip for the Interview
When an interviewer asks "What would you improve?", mention:
1. **Anomaly Detection**: Using ML to detect unusual spikes in error frequency.
2. **WebSocket Streams**: Real-time "live" feed in the dashboard.
3. **Rust/Go Workers**: Rewriting the event worker in a low-level language for even higher throughput.

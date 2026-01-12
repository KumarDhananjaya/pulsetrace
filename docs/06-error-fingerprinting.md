# 06 - Error Fingerprinting

Fingerprinting is the process of grouping unique error events into a single "Issue" to reduce noise.

## 🧬 Algorithm Logic

```mermaid
flowchart TD
    E[Event Arrives] --> S[Extract Stack Trace]
    S --> C[Clean: Remove file paths/line numbers]
    C --> G{Custom Grouping?}
    G -- Yes --> H[Use Custom Fingerprint]
    G -- No --> H2[SHA-256 Hash of Trace]
    H/H2 --> D[Check DB for Fingerprint]
    D --> |Found| U[Increment Event Count]
    D --> |New| N[Create New Issue]
```

## 🧹 Trace Normalization
To ensure stability, we normalize stack traces before hashing:
- Remove variable memory addresses.
- Redact user-specific file paths (e.g., `/Users/name/` -> `/src/`).
- Focus on function names and module hierarchy.

By focusing on the *cause* of the error rather than its *location in time*, we provide a clean, aggregated developer experience.

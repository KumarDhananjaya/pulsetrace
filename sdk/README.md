# @pulsetrace/sdk 🕵️‍♂️

The lightweight, high-performance heartbeat of the PulseTrace ecosystem. This SDK intercepts errors, tracks user breadcrumbs, and monitors performance vitals.

## ✨ Features
- **Auto-error tracking**: Captures uncaught exceptions & promise rejections.
- **Breadcrumbs**: Automatically records clicks, console logs, and navigation history.
- **Transport Batching**: Queues events to reduce network overhead.
- **Performance monitoring**: Web Vitals (LCP, FID, CLS) and API response tracking.
- **Fallback safety**: Uses `navigator.sendBeacon` for reliable delivery on page exit.

## 🚀 Installation

```bash
npm install @pulsetrace/sdk
```

## 🛠️ Usage

### 1. Initialize the SDK
```javascript
import { init } from '@pulsetrace/sdk';

init({
  dsn: 'https://your-dsn-here',
  environment: 'production',
  release: 'v1.0.0',
  debug: true,
  maxBatchSize: 5,     // Optional
  flushInterval: 10000 // Optional (10s)
});
```

### 2. Manual Exception Capture
```javascript
import { captureException } from '@pulsetrace/sdk';

try {
  doSomethingRisky();
} catch (error) {
  captureException(error, { extra: { userId: 123 } });
}
```

## 📜 Configuration Settings

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `dsn` | `string` | - | Your ingestion endpoint. |
| `debug` | `boolean` | `false` | Enable verbose logging. |
| `sampleRate`| `number`| `1.0` | Percentage of events to send (0.0 to 1.0). |
| `environment`| `string`| - | e.g. 'production' or 'staging'. |

## 🛡️ License
MIT

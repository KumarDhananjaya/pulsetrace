# PulseTrace Dashboard 📊

A premium React interface for visualizing error trends, drilling into stack traces, and monitoring performance vitals.

## ✨ Features
- **Issue Feed**: Real-time listing of unique exceptions and errors.
- **Deep-Dive**: Interactive visualization of stack traces and user breadcrumbs.
- **Performance**: Charts and distributions for Core Web Vitals (LCP, FID, CLS).
- **Modern Aesthetic**: Highly responsive, dark-mode UI built with Tailwind CSS.

## 🚀 Setting Up

### Prerequisites
- Node.js v18+
- PulseTrace Ingestion API (running)

### Installation

```bash
cd dashboard
npm install
```

### Environment Variables
Create a `.env` file in the `dashboard` root:
```env
VITE_API_URL="http://localhost:3001"
```

### Development
```bash
npm run dev
```

## 🛠️ Technology Stack
- **React**: Frontend framework.
- **Tailwind CSS**: Utility-first styling.
- **Lucide React**: Premium iconography.
- **Recharts**: Data visualization.
- **Date-fns**: Robust date formatting.

## 🛡️ License
MIT

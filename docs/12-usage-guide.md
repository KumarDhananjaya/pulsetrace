# 12 - Usage Guide: Getting Started with PulseTrace

This guide walks you through the end-to-end process of setting up PulseTrace and integrating it into your application.

---

## 🏗️ Step 1: Start the Infrastructure
PulseTrace requires PostgreSQL and Redis. We provide a Docker Compose file to spin these up instantly.

1. Open your terminal in the project root.
2. Run:
   ```bash
   docker-compose up -d
   ```
3. Verify the containers are running:
   ```bash
   docker ps
   ```
   *(You should see `pulsetrace-db` on port 5433 and `pulsetrace-redis` on port 6379)*

---

## 📥 Step 2: Start the Ingestion API
The API handles incoming telemetry and processes it in the background.

1. Navigate to the `api` folder:
   ```bash
   cd api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   *(The API is now listening at `http://localhost:3001`)*

---

## 🕵️ Step 3: Integrate the SDK
Now, let's add PulseTrace to your frontend application (e.g., React, Vue, or Vanilla JS).

1. Install the SDK:
   ```bash
   npm install @pulsetrace/sdk
   ```
2. Initialize it at the top of your `main.js` or `App.js`:
   ```javascript
   import { init } from '@pulsetrace/sdk';

   init({
     dsn: 'http://localhost:3001/api/collect',
     environment: 'production',
     release: 'v1.0.0',
     debug: true // See logs in your browser console
   });
   ```

3. **Test it!** Trigger a manual error anywhere in your app:
   ```javascript
   throw new Error("PulseTrace is working!");
   ```

---

## 📊 Step 4: View the Dashboard
Finally, visualize your errors and performance metrics.

1. Navigate to the `dashboard` folder:
   ```bash
   cd dashboard
   ```
2. Install and start:
   ```bash
   npm install
   ```
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.
4. Click on the **"Issues"** tab. You should see your "PulseTrace is working!" error aggregated there!

---

## 🚀 Summary
1. **Docker**: `docker-compose up -d`
2. **API**: `npm run dev`
3. **SDK**: `init({ dsn: '...' })`
4. **Dashboard**: `npm run dev` -> View `localhost:5173`

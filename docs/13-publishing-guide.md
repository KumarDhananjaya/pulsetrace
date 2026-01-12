# 13 - Publishing Guide: Shipping to NPM 📦

This guide explains how to publish the `@pulsetrace/sdk` to the official NPM registry so other developers can install it via `npm install`.

---

## 🔒 1. NPM Authentication
Before publishing, you must be logged into your NPM account in your terminal.

1. If you don't have an account, sign up at [npmjs.com](https://www.npmjs.com/).
2. In your terminal, run:
   ```bash
   npm login
   ```
3. Follow the prompts to authenticate via your browser.

---

## 🏗️ 2. Build for Production
Ensure the SDK is built and the `dist/` folder is up to date.

1. Navigate to the `sdk` folder:
   ```bash
   cd sdk
   ```
2. Run the build command:
   ```bash
   npm run build
   ```
3. Verify that the `dist/` folder contains `index.js` and `index.d.ts`.

---

## 🏷️ 3. Versioning (Optional)
If you have made changes since the last version (0.0.1), you should increment the version.

- For minor fixes: `npm version patch` (0.0.1 -> 0.0.2)
- For new features: `npm version minor` (0.0.1 -> 0.1.0)
- For breaking changes: `npm version major` (0.0.1 -> 1.0.0)

---

## 🚀 4. Publish to the Registry
Since the package is scoped (`@pulsetrace/sdk`), it is marked as public in configuration.

1. Run the publish command:
   ```bash
   npm publish --access public
   ```
2. **If you have 2FA enabled**: NPM will prompt you for an OTP (One-Time Password) in the terminal. Enter the code from your authenticator app.
3. **If it still fails with 403 (2FA required)**: 
   - Go to [npmjs.com/settings/your-username/tokens](https://www.npmjs.com/settings/).
   - Generate a **"Granular Access Token"** or **"Automation Token"**.
   - Ensure the token has `Read and Write` access to your packages.
   - Use the token to authenticate or follow the [GitHub Actions bypass](https://docs.npmjs.com/generating-access-tokens-on-the-command-line) steps.

---

## ✅ 5. Verify Publication
1. Go to `https://www.npmjs.com/package/@pulsetrace/sdk`.
2. Try installing it in a fresh project:
   ```bash
   npm install @pulsetrace/sdk
   ```

## ⚠️ Notes
- **Pre-publish check**: The `prepublishOnly` script in `package.json` automatically runs `npm run build` before publishing to ensure you never ship uncompiled code.
- **Privacy**: Only files listed in the `files` array in `package.json` (plus README and LICENSE) will be uploaded. Your source code in `src/` remains local to your repository.
- **Repository Fix**: I have updated the `repository.url` to `git+https://github.com/...` to satisfy NPM's normalization check.

# 14 - Publishing Guide: GitHub Packages (GPR) 🐙

This guide explains how to publish the `@kumardhananjaya/sdk` to GitHub Packages so it can be used across your GitHub repositories.

---

## 🔐 1. Authentication (Personal Access Token)
GitHub Packages requires a Personal Access Token (PAT) for authentication.

1. Go to **Settings > Developer settings > Personal access tokens > Tokens (classic)**.
2. Generate a new token with at least `write:packages`, `read:packages`, and `repo` scopes.
3. Save this token securely—you will not see it again.

> [!IMPORTANT]
> When running `npm login`, you MUST use this **Personal Access Token** as your password. Your regular GitHub account password will NOT work and will cause a `401 Unauthorized` error.

---

## 🛠️ 2. Local Setup (`.npmrc`)
You need to tell `npm` to use GitHub's registry for your scope.

1. Create a `.npmrc` file in the `sdk/` folder (or your user home directory):
   ```bash
   //npm.pkg.github.com/:_authToken=YOUR_PAT_TOKEN
   @kumardhananjaya:registry=https://npm.pkg.github.com/
   ```
   *(Be careful not to commit your actual token to Git!)*

---

## 🏗️ 3. Build & Verify
Ensure the package is ready for distribution.

1. Navigate to the `sdk` folder:
   ```bash
   npm run build
   ```
2. Verify `package.json` contains:
   ```json
   "publishConfig": {
     "registry": "https://npm.pkg.github.com/"
   }
   ```

---

## 🚀 4. Publish
Unlike the public NPM registry, GitHub Packages requires the scope (`@kumardhananjaya`) to match your GitHub username or organization.

1. Run the publish command:
   ```bash
   npm publish
   ```

---

## ✅ 5. Installing the Package
To install this package in another project, that project must also have a `.npmrc` pointing to GitHub Packages:

```bash
@kumardhananjaya:registry=https://npm.pkg.github.com/
```

Then run:
```bash
npm install @kumardhananjaya/sdk
```

## 🆘 Troubleshooting (Still getting 401?)
If you are still getting `401 Unauthorized` after following the steps above, try this "Clean Slate" approach:

1. **Delete conflicting configs**:
   In your terminal, run:
   ```bash
   rm sdk/.npmrc
   rm ~/.npmrc
   ```
2. **Re-Verify Token Scopes**:
   Ensure your GitHub PAT has **EXACTLY** these boxes checked:
   - `write:packages`
   - `read:packages`
   - `repo` (all sub-boxes)

3. **Manual Token Injection**:
   Create a new `sdk/.npmrc` with this EXACT format (replace `YOUR_TOKEN_HERE`):
   ```bash
   @kumardhananjaya:registry=https://npm.pkg.github.com/
   //npm.pkg.github.com/:_authToken=YOUR_TOKEN_HERE
   ```
   *(Wait 2 minutes after generating the token—sometimes GitHub takes a moment to propagate permissions.)*

4. **Final Attempt**:
   ```bash
   cd sdk
   npm publish
   ```

## ⚠️ Notes
- **Scope Consistency**: The package name must be `@your-username/sdk`. I have already updated `package.json` to `@kumardhananjaya/sdk`.
- **Visibility**: By default, packages published to a public repository's GPR are also public.

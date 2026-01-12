# Contributing to PulseTrace 🚀

Thank you for your interest in contributing to PulseTrace! We welcome all contributions, from bug reports to new features.

## 🛠️ Development Setup

PulseTrace is organized as a set of separate modules:
- `sdk/`: JavaScript/TypeScript SDK
- `api/`: Node.js/Express Ingestion API
- `dashboard/`: React Dashboard

To get started:
1. Fork the repository.
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/pulsetrace.git`
3. Install dependencies in each component:
   ```bash
   cd sdk && npm install
   cd ../api && npm install
   cd ../dashboard && npm install
   ```

## 🌿 Branching Strategy

- **main**: Production-ready code.
- **feature/***: New features.
- **fix/***: Bug fixes.
- **docs/***: Documentation changes.

## 📝 Pull Request Process

1. Create a new branch for your changes.
2. Ensure your code follows the existing style and passes all lint checks.
3. Update documentation (READMEs) if you add or change functionality.
4. Submit a PR against the `main` branch with a clear description of your changes.

## 🎨 Coding Standards

- We use **TypeScript** for all projects to ensure type safety.
- Follow the existing formatting (ESLint/Prettier).
- Provide descriptive commit messages following [Conventional Commits](https://www.conventionalcommits.org/).

## 💬 Community

If you have questions, please open a GitHub Issue. We appreciate your feedback!

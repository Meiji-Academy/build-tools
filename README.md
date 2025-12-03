# Build Tools

This repository contains shared build utilities and plugins used across Meiji development projects to ensure consistent environment configurations and build reproducibility.

## Components

### 1. Gradle Plugin (Backend)

Enforces the presence of required credentials for GitHub Packages before attempting dependency resolution.

**Usage:**
Add the following to your Spring Boot `build.gradle` or `build.gradle.kts`:

```
plugins {
    id("com.meiji.build.environment-check") version "1.0.0"
}
```

**Requirements:**

- **CI:** `GITHUB_TOKEN` environment variable must be set.
- **Local:** `~/.gradle/gradle.properties` must contain `gpr.user` and `gpr.key`.

### 2. NPM Utilities (Frontend)

A CLI tool to validate the local `.npmrc` configuration or CI environment variables for frontend repositories.

**Usage:**
Install as a dev dependency and add to your `preinstall` script.

```
npm install --save-dev @meiji/dev-utils
```

**package.json configuration:**

```
"scripts": {
  "preinstall": "meiji-env-check"
}
```

**Requirements:**

- **CI:** `GITHUB_TOKEN` environment variable must be set.
- **Local:** User must be authenticated via `npm login` against the GitHub Package Registry.

## License

MIT
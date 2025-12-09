# Meiji Academy Build Tools

This repository contains shared build utilities and plugins used across Meiji Academy development projects to ensure consistent environment configurations and build reproducibility.

## Components

### 1. Gradle Plugin (Backend)

Enforces the presence of required credentials for GitHub Packages before attempting dependency resolution.

**Usage:**
Add the following to your Spring Boot `build.gradle` or `build.gradle.kts`. Using `latest.release` ensures you always get the newest version automatically (cached for 24h).

```
plugins {
    id("com.meijiacademy.build.tools") version "latest.release"
}
```

**Requirements:**

- **CI:** `MEIJI_ACADEMY_PACKAGES_TOKEN` environment variable must be set.
- **Local:** `~/.gradle/gradle.properties` must contain `gpr.user` and `gpr.key`.

### 2. NPM Utilities (Frontend)

A CLI tool to validate the local `.npmrc` configuration or CI environment variables for frontend repositories.

**Installation:**

Install with the `@latest` tag to ensure your `package.json` tracks the newest version.

```
npm install --save-dev @meiji-academy/build-tools@latest
```

**Usage (package.json):**

Add it to your scripts to ensure the environment is checked before every install.

```
"scripts": {
  "preinstall": "meiji-env-check"
}
```

**Requirements:**

- **CI:** `MEIJI_ACADEMY_PACKAGES_TOKEN` environment variable must be set.
- **Local:** User must be authenticated via `npm login` against the GitHub Package Registry with scope `@meiji-academy`.

## License

MIT
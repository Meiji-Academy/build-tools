# Meiji Academy Build Tools

This repository contains shared build utilities and plugins used across Meiji Academy development projects to ensure consistent environment configurations and build reproducibility.

## Migration Note

⚠️ **Workflow Relocation:** The `cleanup-packages.yml` and `reusable-auto-assign.yml` workflows have been moved to the [meiji-academy/github-workflows](https://github.com/meiji-academy/github-workflows) repository. They remain available in this repository at the `1.3.0` tag, so callers can pin to `@1.3.0` until they migrate.

## Components

Enforces the presence of required credentials.

**Usage:**

Add the following to your Spring Boot `build.gradle.kts`.
We recommend pinning a specific version for build reproducibility.

```kotlin
plugins {
    id("com.meijiacademy.build.tools") version "<version>" // e.g. "1.4.0"
}
```
You can rely on Dependabot to update this version via Pull Requests.

**Requirements:**

- **CI:** `MEIJI_ACADEMY_PACKAGES_TOKEN` environment variable must be set.
- **Local:** Credentials (`gpr.user` and `gpr.key`) must be provided. We recommend placing these in `~/.gradle/gradle.properties` to avoid committing secrets, though they can also be passed via `-P` flags or `ORG_GRADLE_PROJECT_` environment variables.

### 2. NPM Utilities (Frontend)

A CLI tool to validate the local `.npmrc` configuration or CI environment variables for frontend repositories.

**Installation:**

Install with the `@latest` tag. This resolves the latest version at install time; be sure to commit your lockfile to lock the dependency.

```bash
npm install --save-dev @meiji-academy/build-tools@latest
```

**Usage (`package.json`):**

Add it to your scripts. Note that on a fresh clone, npm will attempt to resolve private dependencies before this script runs. It is primarily useful to ensure your environment stays correctly configured for subsequent installs and operations.

```json
{
  "scripts": {
    "preinstall": "meiji-env-check"
  }
}
```

**Requirements:**

- **CI:** Must configure `.npmrc` to authenticate with GitHub Packages using the `MEIJI_ACADEMY_PACKAGES_TOKEN`. For example, add this step before running `npm ci`:
  ```bash
  echo "@meiji-academy:registry=https://npm.pkg.github.com" >> .npmrc
  echo "//npm.pkg.github.com/:_authToken=\${MEIJI_ACADEMY_PACKAGES_TOKEN}" >> .npmrc
  ```
- **Local:** Must be authenticated against GitHub Packages for the `@meiji-academy` scope (e.g., via `npm login`, `~/.npmrc`, or a project-level `.npmrc`).

## Releases

- Pushing a semver tag (e.g., `1.4.0`) triggers the automated release pipeline.
- The pipeline checks if the version already exists. If not, it builds and publishes the Gradle plugin to the Gradle Plugin Portal and the NPM CLI tool to the public NPM registry.

### 3. Dependabot Integration & Templates

Standardized configurations and reusable workflows for automated dependency management.

**Templates (`templates/.github/`):**

- `dependabot-npm.yml`: Standard configuration for NPM projects.
- `dependabot-gradle.yml`: Standard configuration for Gradle / Spring Boot projects.
- `workflows/dependabot-auto-merge.yml`: Project-level workflow trigger for auto-merging.
- `workflows/dependabot-stale.yml`: Project-level workflow trigger for weekly stale PR escalations.

**Reusable Workflows (`.github/workflows/`):**

- `reusable-dependabot-auto-merge.yml`: Approves and enables squash merge for minor/patch updates. Sends a Google Chat alert on major version updates.
- `reusable-dependabot-stale.yml`: Audits open Dependabot PRs older than 7 days, re-requests reviews, and sends Google Chat notifications.

**Setup:**

1. Copy the appropriate `dependabot-*.yml` into your project's `.github/dependabot.yml`.
2. Copy the workflows from `templates/.github/workflows/` into your project's `.github/workflows/`.

### Required Organization Settings

For the Dependabot automations to work correctly across the organization, ensure the following settings and secrets are configured at the **Organization Level**:

**1. Workflow Permissions**
- Navigate to **Settings → Actions → General**.
- Under *Workflow permissions*, select **"Read and write permissions"** and check **"Allow GitHub Actions to create and approve pull requests"**.

**2. Secrets Configuration**
Since Dependabot runs in an isolated context, it cannot access standard Actions secrets. You must configure secrets in **both** locations:

**Organization Dependabot Secrets** (`Settings → Secrets and variables → Dependabot`):
- `ORG_DEFAULT_DEPENDENCY_CHAT_WEBHOOK`: Required for Dependabot alert routing (Stale PRs & Major Updates).
- `MEIJI_ACADEMY_PACKAGES_TOKEN`: Required so Dependabot can fetch and update private packages from the GitHub registry.

**Organization Actions Secrets** (`Settings → Secrets and variables → Actions`):
- `MEIJI_ACADEMY_PACKAGES_TOKEN`: Required for standard CI/CD workflows to build and publish packages.

## License

Proprietary - Meiji Academy. All rights reserved.
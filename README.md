# Meiji Academy Build Tools

This repository contains reusable build utilities for Meiji Academy development projects. It currently provides a Gradle plugin for backend projects and an npm CLI utility for frontend projects.

## Components

### Gradle Plugin (Backend)

The Gradle plugin checks that the credentials required to access Meiji Academy's private GitHub Packages are configured.

**Usage**

Add the plugin to your Spring Boot project's `build.gradle.kts`:

```kotlin
plugins {
    id("com.meijiacademy.build.tools") version "1.0.0"
}
```

Pin a specific version for reproducible builds. Dependency updates can be handled through Dependabot in the consuming repository.

**Requirements**

- **CI:** Set the `MEIJI_ACADEMY_PACKAGES_TOKEN` environment variable.
- **Local:** Add `gpr.user` and `gpr.key` to `~/.gradle/gradle.properties`.

### npm Utilities (Frontend)

The npm package provides the `meiji-env-check` CLI command. It checks that the configuration required to access Meiji Academy's private GitHub Packages is present in local development environments and CI.

The CLI package itself is published to the public npm registry; the environment check concerns authentication to the private GitHub Packages registry.

**Installation**

Install it as a development dependency:

```bash
npm install --save-dev @meiji-academy/build-tools@latest
```

This resolves the latest published version at installation time. Commit the package lockfile to keep installs reproducible.

**Usage**

Add the following script to your `package.json` so the environment check runs before dependency installation:

```json
{
  "scripts": {
    "preinstall": "meiji-env-check"
  }
}
```

**Requirements**

- **CI:** Set the `MEIJI_ACADEMY_PACKAGES_TOKEN` environment variable.
- **Local:** Configure GitHub Packages authentication in `~/.npmrc`. The file must contain the GitHub Packages registry (`npm.pkg.github.com`) and an `_authToken` entry. For example, you can configure it with:

  ```bash
  npm login --scope=@meiji-academy --registry=https://npm.pkg.github.com
  ```

### Releases

Releases are handled by [`.github/workflows/release.yml`](.github/workflows/release.yml). Push a version tag in `X.Y.Z` format to trigger the workflow. The tag version is used to publish the Gradle plugin to the Gradle Plugin Portal and the npm package to the public npm registry. Before publishing, the workflow checks whether that version already exists in each registry.

## License

MIT
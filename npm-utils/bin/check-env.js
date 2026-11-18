#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

function isCI() {
    return process.env.CI || process.env.GITHUB_ACTIONS;
}

function checkEnv() {
    if (isCI()) {
        if (!process.env.MEIJI_ACADEMY_PACKAGES_TOKEN) {
            console.error("❌ Build Failed: MEIJI_ACADEMY_PACKAGES_TOKEN environment variable is missing in CI.");
            process.exit(1);
        }
        return;
    }

    const projectNpmrc = path.join(process.cwd(), '.npmrc');
    const userConfigNpmrc = process.env.NPM_CONFIG_USERCONFIG ? path.resolve(process.env.NPM_CONFIG_USERCONFIG) : null;
    const homeNpmrc = path.join(os.homedir(), '.npmrc');

    const npmrcPaths = [projectNpmrc, userConfigNpmrc, homeNpmrc].filter(Boolean);
    let hasAuth = false;
    const missingEnvVars = new Set();

    for (const rcPath of npmrcPaths) {
        if (fs.existsSync(rcPath)) {
            const content = fs.readFileSync(rcPath, 'utf8');
            const lines = content.split('\n');

            for (const line of lines) {
                const trimmedLine = line.trim();

                if (trimmedLine.startsWith('#') || trimmedLine.startsWith(';')) continue;

                if (trimmedLine.startsWith('//npm.pkg.github.com/') && trimmedLine.includes('_authToken')) {
                    const match = trimmedLine.match(/_authToken\s*=\s*(.*)$/);

                    if (match) {
                        let tokenValue = match[1].trim().replace(/^["']|["']$/g, '');
                        const placeholderMatch = tokenValue.match(/^\$\{([^}]+)\}$/);

                        if (placeholderMatch) {
                            const envVarName = placeholderMatch[1];
                            if (process.env[envVarName] && process.env[envVarName].trim() !== '') {
                                hasAuth = true;
                                break;
                            } else {
                                missingEnvVars.add(envVarName);
                            }
                        } else if (tokenValue !== '') {
                            hasAuth = true;
                            break;
                        }
                    }
                }
            }
        }
        if (hasAuth) break;
    }

    if (!hasAuth) {
        if (missingEnvVars.size > 0) {
            const vars = Array.from(missingEnvVars).join(', ');
            console.error(`❌ Build Failed: GitHub Packages authentication failed. The following environment variable(s) were empty or not set: ${vars}`);
        } else {
            console.error("❌ Build Failed: Missing GitHub Packages credentials for @meiji-academy scope.");
            console.error("Please run 'npm login --scope=@meiji-academy --registry=https://npm.pkg.github.com' or configure your .npmrc file.");
        }
        process.exit(1);
    }
}

checkEnv();
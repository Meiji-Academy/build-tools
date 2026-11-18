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

    for (const rcPath of npmrcPaths) {
        if (fs.existsSync(rcPath)) {
            const content = fs.readFileSync(rcPath, 'utf8');
            const lines = content.split('\n');

            for (const line of lines) {
                if (line.includes('npm.pkg.github.com') && line.includes('_authToken=')) {
                    const tokenValue = line.substring(line.indexOf('_authToken=') + 11).trim();
                    const match = tokenValue.match(/^\$\{([^}]+)\}$/);

                    if (match) {
                        const envVarName = match[1];
                        if (process.env[envVarName] && process.env[envVarName].trim() !== '') {
                            hasAuth = true;
                        } else {
                            console.error(`❌ Build Failed: The environment variable '${envVarName}' is not set or empty.`);
                            process.exit(1);
                        }
                    } else if (tokenValue !== '') {
                        hasAuth = true;
                    }
                }
            }
        }
        if (hasAuth) break;
    }

    if (!hasAuth) {
        console.error("❌ Build Failed: Missing GitHub Packages credentials for @meiji-academy scope.");
        console.error("Please run 'npm login --scope=@meiji-academy --registry=https://npm.pkg.github.com' or configure your .npmrc file.");
        process.exit(1);
    }
}

checkEnv();
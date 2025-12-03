#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const RESET = '\x1b[0m';

function run() {
    const isCI = process.env.CI || process.env.GITHUB_ACTIONS;

    if (isCI) {
        validateCI();
    } else {
        validateLocal();
    }
}

function validateCI() {
    if (!process.env.GITHUB_TOKEN) {
        console.error(`${RED}❌ CI Error: GITHUB_TOKEN is missing.${RESET}`);
        process.exit(1);
    }
    console.log(`${GREEN}✔ CI Environment validated.${RESET}`);
}

function validateLocal() {
    const npmrcPath = path.join(os.homedir(), '.npmrc');

    if (!fs.existsSync(npmrcPath)) {
        printInstructions("File ~/.npmrc not found.");
        process.exit(1);
    }

    const content = fs.readFileSync(npmrcPath, 'utf8');
    const hasRegistry = content.includes('npm.pkg.github.com');
    const hasAuth = content.includes('_authToken');

    if (!hasRegistry || !hasAuth) {
        printInstructions("Incomplete ~/.npmrc configuration.");
        process.exit(1);
    }

    console.log(`${GREEN}✔ Local Environment validated.${RESET}`);
}

function printInstructions(reason) {
    console.log(`
${RED}╔════════════════════════════════════════════════════════════════╗
║                  ENVIRONMENT CHECK FAILED                      ║
╠════════════════════════════════════════════════════════════════╣
║ Reason: ${reason.padEnd(54)} ║
║                                                                ║
║ Required Action:                                               ║
║ 1. Generate PAT (read:packages)                                ║
║ 2. Login:                                                      ║
║    npm login --scope=@meiji --registry=https://npm.pkg.github.com ║
╚════════════════════════════════════════════════════════════════╝${RESET}
`);
}

run();
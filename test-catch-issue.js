#!/usr/bin/env node

"use strict";

const { CLIEngine } = require("./lib/cli-engine");

const testCode = `
try {
    throw new Error('test');
} catch (err) {
    console.error(err);
}
`;

const eslint = new CLIEngine({
    useEslintrc: false,
    envs: ["node"],
    rules: {
        "no-unused-vars": ["error", { caughtErrors: "all" }]
    }
});

const report = eslint.executeOnText(testCode);

console.log("Lint report:", report);
console.log("Messages:", report.results[0].messages);

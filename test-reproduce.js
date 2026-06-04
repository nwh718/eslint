#!/usr/bin/env node

"use strict";

const { ESLint } = require("./lib/eslint");

const eslint = new ESLint({
    overrideConfig: {
        rules: {
            "no-unused-vars": ["error", { caughtErrors: "all" }]
        }
    }
});

const testCode = `
try {
    throw new Error('test');
} catch (err) {
    console.error(err);
}
`;

async function runTest() {
    try {
        const results = await eslint.lintText(testCode);
        console.log("Lint Results:");
        console.log(results);
        results.forEach(result => {
            result.messages.forEach(msg => {
                console.log(`- ${msg.message} at line ${msg.line}`);
            });
        });
    } catch (err) {
        console.error("Error:", err);
    }
}

runTest();

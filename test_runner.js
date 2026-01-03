// Simple Custom Test Runner to bypass node_modules limitations in sandbox
const fs = require('fs');
const path = require('path');

// Colors for output
const RESET = "\x1b[0m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function describe(suiteName, fn) {
    console.log(`\n${YELLOW}[TEST SUITE] ${suiteName}${RESET}`);
    fn();
}

function it(testName, fn) {
    totalTests++;
    try {
        fn();
        console.log(`  ${GREEN}✔ ${testName}${RESET}`);
        passedTests++;
    } catch (error) {
        console.error(`  ${RED}✘ ${testName}${RESET}`);
        console.error(`    ${RED}${error.message}${RESET}`);
        failedTests++;
    }
}

function expect(actual) {
    return {
        toBe: (expected) => {
            if (actual !== expected) {
                throw new Error(`Expected ${expected} but got ${actual}`);
            }
        },
        toEqual: (expected) => {
             // Simple deep equality check
            const actualStr = JSON.stringify(actual);
            const expectedStr = JSON.stringify(expected);
            if (actualStr !== expectedStr) {
                throw new Error(`Expected ${expectedStr} but got ${actualStr}`);
            }
        },
        toBeGreaterThan: (expected) => {
            if (actual <= expected) {
                throw new Error(`Expected ${actual} to be greater than ${expected}`);
            }
        },
        toBeLessThan: (expected) => {
            if (actual >= expected) {
                throw new Error(`Expected ${actual} to be less than ${expected}`);
            }
        },
        toBeTruthy: () => {
            if (!actual) {
                throw new Error(`Expected ${actual} to be truthy`);
            }
        }
    };
}

// Global exposure
global.describe = describe;
global.it = it;
global.expect = expect;

// Load Files to Test
// We need to manually load the source file because it's not a module
// In a real env we would use require or import.
// Since LogisticsCore is a class in a file, let's try to eval it into scope or require it if we modify it to export.

// HACK: Read LogisticsCore.js and append 'module.exports = LogisticsCore;' to make it require-able for this runner
// without modifying the original file if possible. But here I will modify the file momentarily or just read it and eval.

// Better approach: Read the file content, append the export, write to temp file, require temp file.
const sourceCode = fs.readFileSync('./LogisticsCore.js', 'utf8');
const tempFile = './LogisticsCore_temp.js';
fs.writeFileSync(tempFile, sourceCode + '\nmodule.exports = LogisticsCore;');

const LogisticsCore = require(tempFile);

// Run Tests
require('./tests/test_LogisticsCore.js');
require('./tests/test_StrategicPathfinder.js');

// Cleanup
fs.unlinkSync(tempFile);

// Summary
console.log(`\n${"=".repeat(20)}`);
console.log(`Total: ${totalTests} | Passed: ${GREEN}${passedTests}${RESET} | Failed: ${RED}${failedTests}${RESET}`);

if (failedTests > 0) {
    process.exit(1);
}

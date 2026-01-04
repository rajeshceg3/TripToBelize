// Professional Test Runner
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
        console.error(error.stack);
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

// Global exposure for test files
global.describe = describe;
global.it = it;
global.expect = expect;

// Load Source Modules Directly (Now that they are UMD/CommonJS compatible)
try {
    global.LogisticsCore = require('./LogisticsCore.js');
    global.StrategicPathfinder = require('./StrategicPathfinder.js');
} catch (e) {
    console.error(`${RED}CRITICAL FAILURE: Could not load source modules.${RESET}`);
    console.error(e);
    process.exit(1);
}

// Run Tests
try {
    require('./tests/test_LogisticsCore.js');
    require('./tests/test_StrategicPathfinder.js');
} catch (e) {
    console.error(`${RED}CRITICAL FAILURE: Error running tests.${RESET}`);
    console.error(e);
    failedTests++;
}

// Summary
console.log(`\n${"=".repeat(20)}`);
console.log(`Total: ${totalTests} | Passed: ${GREEN}${passedTests}${RESET} | Failed: ${RED}${failedTests}${RESET}`);

if (failedTests > 0) {
    process.exit(1);
}

#!/bin/bash
set -e

# Clean up previous build
rm -rf build

# Create directory structure
mkdir -p build/css
mkdir -p build/js/modules

# Copy static assets
cp index.html build/
cp css/styles.css build/css/

# Copy JS files
cp js/data.js build/js/
cp js/modules/Overwatch.js build/js/modules/
cp js/modules/TelemetryStream.js build/js/modules/

# Copy all root JS files
cp *.js build/

# Remove development and test files from build
rm -f build/jest.config.js
rm -f build/test_runner.js
rm -f build/reproduction.js
# Remove self (if it were copied, though it's .sh)
rm -f build/build.sh

echo "Build complete. Artifacts in build/"

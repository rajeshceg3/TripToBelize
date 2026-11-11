# Verify TripToBelize
Belize: An Elemental Journey - static journey planner with logistics/mission simulator modules (jest unit+integration tests).
## Launch
Any static file server from the repo root; npm test for the jest suites.
## Doctor
`python3 .cursor/skills/verify-trip-to-belize/verify.py`
## Drive
Runs the jest unit+integration suites, serves the static site, and renders it in headless Chromium asserting the boot marker and zero JS console errors.
## Evidence
`.cursor/skills/verify-trip-to-belize/evidence.json`
## Cleanup
Static server terminated after the render.
## Known boundaries
Render smoke only; scene quality and e2e suites (cypress/playwright/puppeteer) not exercised here.

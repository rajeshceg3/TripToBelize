# Elite Test Strategy: Operation Ironclad

## 1. Mission Overview
This document outlines the testing infrastructure for the **TripToBelize** tactical mission planner. The goal is to establish a defensible, professional-grade quality assurance system that guarantees functional correctness, regression safety, and deployment confidence.

## 2. Test Pyramid Architecture

We employ a 3-layered strategy:

### Level 1: Unit Tests (Jest) - *The Foundation*
*   **Purpose**: Verify the correctness of pure logic and individual components in isolation.
*   **Coverage**:
    *   `LogisticsCore.js`: Resource calculations, risk assessment, gear validation.
    *   `StrategicPathfinder.js`: A* algorithm, grid costs, heuristic accuracy.
    *   `DecisionSupport.js`: Data persistence, scenario management (mocked localStorage).
*   **Tools**: Jest, JSDOM (for storage mocks).

### Level 2: Integration Tests (Jest) - *The Wiring*
*   **Purpose**: Verify that modules collaborate correctly without the full browser overhead.
*   **Coverage**:
    *   `MissionSimulator` + `StrategicPathfinder`: Ensure the simulator correctly consumes the pathfinder's output.
    *   `MissionSimulator` + `LogisticsCore`: Ensure simulation ticks correctly deplete resources based on logistics logic.
*   **Tools**: Jest.

### Level 3: End-to-End Tests (Playwright) - *The Mission Rehearsal*
*   **Purpose**: Verify the full user journey from a user's perspective in a real browser environment.
*   **Coverage**:
    *   **Phase 1: Infiltration**: Intro screen bypass, map loading.
    *   **Phase 2: Planning**: Selecting markers, adding waypoints, checking route details.
    *   **Phase 3: Execution**: Running the simulation, observing marker movement, verifying log updates.
    *   **Phase 4: Mobile**: Verifying responsive layout and touch interactions.
*   **Tools**: Playwright (Headless Chromium/WebKit).

## 3. Directory Structure

```
/
├── tests/                  # Unit & Integration Tests (Jest)
│   ├── unit/
│   │   ├── LogisticsCore.test.js
│   │   ├── StrategicPathfinder.test.js
│   │   └── DecisionSupport.test.js
│   └── integration/
│       └── MissionSimulator.test.js
├── verification/           # E2E Tests (Playwright)
│   ├── e2e/
│   │   ├── mission.spec.js
│   │   └── mobile.spec.js
│   └── playwright.config.js
└── test_runner.js          # DEPRECATED (Legacy Runner)
```

## 4. Quality Gates & CI/CD

### GitHub Actions Workflow
*   **Trigger**: Push to `main`, Pull Request.
*   **Steps**:
    1.  Install Dependencies (Deterministic `npm ci`).
    2.  Linting (Future scope).
    3.  **Unit & Integration Tests**: `npm run test:unit`.
    4.  **E2E Tests**: `npm run test:e2e`.
    5.  **Artifacts**: Upload Playwright traces/screenshots on failure.

### Coverage Targets
*   **Critical Paths**: 100% Logic Coverage (Logistics, Pathfinder).
*   **Overall**: >80% Statement Coverage.

## 5. Execution Plan

1.  **Refactor**: Move existing tests to standard Jest format.
2.  **Implementation**: Write missing Unit/Integration tests.
3.  **E2E Setup**: Initialize Playwright and port verification logic.
4.  **CI/CD**: Configure GitHub Actions.
5.  **Final Polish**: Ensure all tests pass and documentation is updated.

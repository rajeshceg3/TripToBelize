# STRATEGIC ROADMAP: OPERATION IRONCLAD

**Target:** Repository "TripToBelize"
**Classification:** CLASSIFIED // TECHNICAL EYES ONLY
**Author:** Jules, Lead Technical Operator
**Date:** 2024-05-23 (Updated)
**Status:** ACTIVE EXECUTION

---

## 1. SITUATION REPORT (SITREP)

### 1.1 Executive Summary
The "TripToBelize" system is currently in a **Beta/Prototype** state. While the visual layer (UI/UX) utilizes a sophisticated "Ethereal Tech" design system, the underlying engineering foundation is fragile and threatens operational continuity. The codebase relies on a monolithic "God Object" (`app.js`) and lacks a standard production pipeline.

**Operational Status:**
-   **UX/UI:** **AMBER** (Visually strong, but relies on manual DOM manipulation; Accessibility is manual and potentially brittle).
-   **Architecture:** **RED** (Monolithic, tight coupling).
-   **Security:** **AMBER** (No CSP, some manual sanitization, vulnerability surfaces exist).
-   **Reliability:** **RED** (Fragile custom test runner, no CI/CD).

### 1.2 Asset Inventory
*   **Frontend:** HTML5, CSS3 (Extracted & Clean), Leaflet.js.
*   **Logic:** `app.js` (700+ lines, mixed concerns).
*   **Modules:** `LogisticsCore`, `DecisionSupport`, `StrategicPathfinder` (UMD pattern).
*   **Testing:** `test_runner.js` (Legacy, to be decommissioned).

---

## 2. MISSION OBJECTIVES

**Primary Goal:** Elevate repository to **Tier-1 Production Readiness** while maximizing **Operator Efficiency (UX)**.

**Key Performance Indicators (KPIs):**
1.  **Code Decoupling:** Reduce `app.js` size by 80% via modularization.
2.  **Test Coverage:** Achieve >90% coverage on core logic using Jest.
3.  **Security:** Implement strict Content Security Policy (CSP) and automated vulnerability scanning.
4.  **UX Compliance:** Achieve WCAG 2.1 AA Standards and <1s Interaction to Next Paint (INP).

---

## 3. TACTICAL EXECUTION PLAN

### PHASE 1: FOUNDATION & SECURITY (Immediate Priority)
*Focus: Secure the perimeter and establish ground rules.*

1.  **Test Infrastructure overhaul:**
    *   **Action:** Delete `test_runner.js`.
    *   **Action:** Configure `jest` to support both CommonJS and ES Modules.
    *   **Action:** Port existing tests to standard `*.test.js` format.
2.  **Dependency Hardening:**
    *   **Action:** Audit `package.json`.
    *   **Action:** Setup `npm run lint` with strict ESLint rules.
3.  **Security Implementation:**
    *   **Action:** Add CSP `<meta>` tag to `index.html`.
    *   **Action:** Audit `innerHTML` usage in `app.js` (specifically `mcLogContainer`, `briefText`).

### PHASE 2: OPERATION "SHATTER MONOLITH" (Code Quality)
*Focus: Dismantle `app.js` and enforce separation of concerns.*

1.  **Module Extraction:**
    *   **Target:** `UIManager.js` (Handle DOM, Event Listeners).
    *   **Target:** `MapController.js` (Leaflet logic, markers, layers).
    *   **Target:** `StateManager.js` (Expedition data, active selections).
2.  **Refactoring:**
    *   Convert UMD modules (`LogisticsCore`, etc.) to standard **ES Modules**.
    *   Remove global variables (`activeMarker`, `map`, `locations`).

### PHASE 3: UX ELEVATION & ACCESSIBILITY (Critical Enhancement)
*Focus: Enhance the operator experience and ensure mission accessibility.*

1.  **Accessibility (A11y) Hardening:**
    *   **Action:** Implement automated focus trapping for all Modals (`briefing-modal`, `archives-modal`).
    *   **Action:** Ensure all custom interactive elements (Canvases, divs) have valid `role`, `aria-label`, and keyboard listeners (`Enter`/`Space`).
    *   **Action:** Verify Screen Reader announcements for dynamic updates (Mission Control logs).
2.  **Performance & Responsiveness:**
    *   **Action:** Implement `IntersectionObserver` for lazy loading panel images.
    *   **Action:** Optimize touch targets for mobile operators (>44px).
    *   **Action:** Reduce First Contentful Paint (FCP) by deferring non-critical scripts (Constellations).
3.  **Interaction Design:**
    *   **Action:** Add loading skeletons for data-fetching states.
    *   **Action:** Implement "Undo" functionality for critical actions (Mission Abort, Route Clear).

### PHASE 4: DEPLOYMENT & SCALE
*Focus: Optimization for field deployment.*

1.  **Asset Optimization:**
    *   Implement Service Worker for offline capabilities (PWA).
2.  **Build System:**
    *   Introduce `Vite` or `Webpack` for bundling and minification.

---

## 4. IMMEDIATE ACTION ORDERS (Next 24 Hours)

The following tasks are authorized for immediate execution:

- [ ] **[P0] Decommission Legacy Test Runner.** Replace `test_runner.js` with a working Jest configuration.
- [ ] **[P1] Architecture Refactor.** Begin splitting `app.js` by extracting `MapController.js`.
- [ ] **[P1] Security Hardening.** Implement Content Security Policy (CSP).
- [ ] **[P2] Accessibility Audit.** Verify keyboard navigation flow through the "Tactical Archives".

---

**COMMANDER'S INTENT:**
We are moving from "Code that works" to "Code that survives." Precision, modularity, testability, and a seamless operator experience are non-negotiable.

**END OF REPORT**

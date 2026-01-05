# STRATEGIC ROADMAP: OPERATION IRONCLAD

**Target:** Repository "TripToBelize"
**Classification:** CLASSIFIED // TECHNICAL EYES ONLY
**Author:** Jules, Lead Technical Operator
**Date:** 2024-05-23
**Status:** ACTIVE PLANNING

---

## 1. SITUATION REPORT (SITREP)

### 1.1 Overview
The "TripToBelize" repository is a tactical mission planner designed for expedition logistics and risk assessment. While the core algorithmic assets (Pathfinding, Logistics) show promise, the system's current architecture is a "Prototype-Grade" monolith. It lacks the structural integrity, security hardening, and operational efficiency required for a "Production-Ready" deployment.

### 1.2 Asset Inventory
*   **Frontend:** HTML5/CSS3 (Glassmorphism UI), Leaflet.js (Mapping).
*   **Logic:** Vanilla JavaScript (ES6+), UMD Modules.
*   **Data:** JSON-like structures embedded in code (`app.js`).
*   **Testing:** Custom `test_runner.js` (Fragile), Jest installed but underutilized.

### 1.3 Threat Assessment (Gap Analysis)
| Severity | Threat Vector | Description |
| :--- | :--- | :--- |
| **CRITICAL** | **Architecture** | `app.js` (47KB) is a "God Object" managing UI, Map, and Logic simultaneously. Zero separation of concerns. |
| **CRITICAL** | **Maintainability** | `index.html` contains ~700 lines of embedded CSS. Updates require surgery on the document root. |
| **HIGH** | **Security** | No Content Security Policy (CSP). Potential XSS vectors via `innerHTML` usage in `app.js`. |
| **HIGH** | **Reliability** | Testing infrastructure relies on file-system hacks. No automated CI/CD pipeline. |
| **MEDIUM** | **Performance** | No build step. Assets load synchronously. Large initial payload. |
| **MEDIUM** | **UX/A11y** | Accessibility is manual and incomplete. Focus trapping is custom and potentially brittle. |

---

## 2. MISSION

**Objective:** Execute a comprehensive transformation of the codebase to achieve **Tier-1 Production Readiness**.

**Success Criteria:**
1.  **Zero Critical Defects:** 100% Test Coverage on core logic.
2.  **Operational Efficiency:** <1s First Contentful Paint (FCP), 60fps UI/Map interactions.
3.  **Security Hardening:** Strict CSP implementation, Zero XSS vulnerabilities.
4.  **User Experience:** WCAG 2.1 AA Compliance, seamless mobile/desktop responsiveness.
5.  **Maintainability:** Modular architecture (ESM), standard build pipeline (Vite/Webpack).

---

## 3. EXECUTION (THE PLAN)

The operation will be conducted in four distinct phases.

### PHASE 1: STABILIZATION & FORTIFICATION (Immediate Priority)
*Focus: Secure the perimeter. Ensure the system is testable and stable before major surgery.*

1.  **Test Infrastructure Overhaul:**
    *   Deprecate `test_runner.js`.
    *   Configure Jest to natively handle UMD/CommonJS modules.
    *   Establish a baseline "Green" test suite.
2.  **Linting & Standardization:**
    *   Enforce `ESLint` and `Prettier` rules.
    *   Eliminate implicit globals and unused variables.
3.  **Directory Restructuring:**
    *   Create `src/`, `tests/`, `public/` hierarchy.
    *   Move assets to appropriate silos.

### PHASE 2: DECOUPLING & REFACTORING (Short Term)
*Focus: Break the monolith. Isolate systems for independent operation.*

1.  **CSS Extraction:**
    *   Migrate embedded styles from `index.html` to `src/css/main.css`, `src/css/components/`.
    *   Implement CSS Variables for "Ethereal Tech" design system.
2.  **Logic Separation:**
    *   Decompose `app.js` into focused modules:
        *   `UIManager.js`: DOM manipulation.
        *   `MapController.js`: Leaflet integration.
        *   `AppCore.js`: State management.
    *   Externalize data (`locations` array) to `src/data/locations.json`.
3.  **Module Standardization:**
    *   Convert UMD modules to standard ES Modules (ESM) for browser/bundler compatibility.

### PHASE 3: SECURITY & PERFORMANCE HARDENING (Medium Term)
*Focus: Lock down the system and optimize for speed.*

1.  **Security Protocol:**
    *   Implement strict **Content Security Policy (CSP)**.
    *   Audit and sanitize all DOM insertions (`textContent` > `innerHTML`).
    *   dependency audit (`npm audit`).
2.  **Build Pipeline:**
    *   Introduce a build tool (e.g., Vite) for minification, bundling, and asset optimization.
    *   Implement image optimization (WebP conversion).
3.  **Performance Tuning:**
    *   Lazy-load off-screen images (`IntersectionObserver`).
    *   Debounce high-frequency map events.

### PHASE 4: UX ELEVATION & COMPLIANCE (Long Term)
*Focus: Enhance the operator experience.*

1.  **Accessibility (A11y) Audit:**
    *   Ensure full keyboard navigability (Focus Rings, Tab Order).
    *   ARIA role verification for all interactive custom controls.
    *   Screen reader compatibility check.
2.  **Progressive Web App (PWA):**
    *   Generate `manifest.json`.
    *   Implement Service Worker for offline map caching (Mission Critical for remote ops).
3.  **Mobile Optimization:**
    *   Refine touch targets (>44px).
    *   Optimize "Bottom Sheet" interactions on mobile devices.

---

## 4. LOGISTICS & SUPPORT

### 4.1 Tooling
*   **Version Control:** Git (Branching Strategy: Feature Branches > Main).
*   **CI/CD:** GitHub Actions (Lint, Test, Build on Push).
*   **Testing:** Jest (Unit), Playwright (E2E/Visual).

### 4.2 Documentation
*   Maintain `AGENTS.md` (if created) for AI-specific context.
*   Generate JSDoc for all core logic modules.

---

## 5. IMMEDIATE ACTION ITEMS (Tactical Queue)

Authorized agents are directed to execute the following tasks immediately:

- [ ] **[P1] Initialize Standard Directory Structure.**
- [ ] **[P1] Configure Jest for Robust Testing.**
- [ ] **[P1] Extract CSS from `index.html`.**
- [ ] **[P2] Modularize `app.js`.**

---

**COMMANDER'S INTENT:**
We do not ship broken code. We do not compromise on security. We deliver a tool that works when the network is down and the pressure is up. Execute with precision.

**END OF REPORT**

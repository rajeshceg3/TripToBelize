# TACTICAL BUG REPORT: OPERATION SENTINEL
**Classification:** CLASSIFIED // INTERNAL
**Date:** 2024-05-22
**Reporter:** J. Jules, Task Force QA Lead

## Executive Summary
A comprehensive vulnerability assessment of the "Trip to Belize" Tactical Mission Planner has revealed critical flaws in the pathfinding logic, resource simulation, and operational security. While the UI layer demonstrates high polish, the underlying simulation engine contains defects that could lead to catastrophic mission planning errors (e.g., routing units through high-risk zones without warning).

---

## 1. Critical Vulnerabilities (Mission Failure Risk)

### 1.1. Pathfinding "Ghost Route" Failure
**Severity:** CRITICAL
**Module:** `StrategicPathfinder.js`
**Description:**
The A* algorithm includes a hard iteration limit (`maxIters = 2000`). If a path cannot be found within this limit (e.g., complex terrain or "walls" of risk zones), the system silently fails and returns a direct straight line between start and end.
**Impact:**
The simulation will render a path that ignores all obstacles and risk zones. Units may be routed directly through high-threat areas (e.g., active volcanoes, enemy strongholds) with no warning to the operator.
**Reproduction:**
Attempt to route between two points separated by a dense risk zone.
**Recommendation:**
Return `null` or error on timeout. Trigger an explicit "Pathfinding Failed" state in the simulator.

---

## 2. High Priority Issues (Operational Integrity)

### 2.1. Logistics Resource Drain Logic Error
**Severity:** HIGH
**Module:** `LogisticsCore.js`
**Description:**
The `estimateMissionCost` function calculates total duration including "Stop Overhead" (1.5 hours per location). However, it applies the full resource drain multiplier of the terrain (e.g., "Nature" = 1.5x) to this resting time.
**Impact:**
Mission costs are significantly overestimated. Resting at a jungle base drains supplies as if the unit were trekking through the jungle for 1.5 hours.
**Recommendation:**
Separate "Travel Time" from "Stop Time". Apply a `0.1x` (Resting) modifier to resource drain during stops.

### 2.2. Global Data Mutability
**Severity:** HIGH
**Module:** `js/data.js`
**Description:**
The `window.locations` array is exposed globally and is mutable. Any third-party script or browser extension could inject false coordinates or alter risk levels.
**Impact:**
Potential for malicious data tampering leading to incorrect mission briefs.
**Recommendation:**
`Object.freeze()` the data structure immediately after definition.

---

## 3. Medium Priority Issues (UX & Accessibility)

### 3.1. Map Visibility (Contrast)
**Severity:** MEDIUM
**Module:** `css/styles.css`
**Description:**
The CSS filter on Leaflet tiles uses `brightness(0.25)`, rendering the map extremely dark on standard displays.
**Impact:**
Poor visibility of terrain features, reducing situational awareness.
**Recommendation:**
Adjust brightness to `0.5` or `0.6` to balance aesthetics with usability.

### 3.2. "Simulate" Button Feedback
**Severity:** MEDIUM
**Module:** `app.js`
**Description:**
The "Simulate" button remains enabled even with insufficient targets (< 2). While this allows for a toast notification, the lack of visual "disabled" state (e.g., greyed out or different cursor) is confusing.
**Impact:**
User frustration when clicking an apparently active button.
**Recommendation:**
Keep the toast, but add a visual indicator (e.g., amber border or partial opacity) when the state is invalid.

---

## 4. Technical Debt & Improvements

- **Reliability:** `MissionSimulator` uses unseeded `Math.random()`, making event reproduction impossible. Recommendation: Implement a seedable PRNG.
- **Architecture:** `app.js` relies on global `window.locations` being present. This coupling is fragile.
- **Testing:** E2E tests depend on a local server which was not reliably starting in CI environments without configuration.

---

**End of Report**
*Verified by J. Jules*

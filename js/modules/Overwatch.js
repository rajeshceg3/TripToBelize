/**
 * Overwatch.js
 *
 * "The Guardian Angel."
 *
 * Integrates Telemetry data with the active Mission Simulation.
 * Detects if new threats intersect the current route and triggers
 * autonomous re-routing protocols.
 */

(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.Overwatch = factory();
    }
}(typeof self !== 'undefined' ? self : this, function() {

    class Overwatch {
        constructor(missionSimulator, strategicPathfinder, tacticalOverlay) {
            this.simulator = missionSimulator;
            this.pathfinder = strategicPathfinder;
            this.overlay = tacticalOverlay;
            this.activeThreats = [];
            this.isEnabled = false;
        }

        /**
         * Activates the Overwatch system.
         */
        engage() {
            this.isEnabled = true;
            // console.log("[Overwatch] System Online. Monitoring active frequencies.");
        }

        disengage() {
            this.isEnabled = false;
            // console.log("[Overwatch] System Standby.");
        }

        /**
         * Process an incoming telemetry signal.
         * @param {Object} intel - The data packet from TelemetryStream.
         */
        processIntel(intel) {
            if (!this.isEnabled) return;
            if (this.simulator.state.status !== 'RUNNING') return;

            // console.log(`[Overwatch] Analyzing Signal: ${intel.message}`);

            // 1. Register Threat
            this.activeThreats.push(intel);

            // 2. Visual Confirmation
            this.overlay.addDynamicRiskZone({
                coords: [intel.location.lat, intel.location.lng],
                radius: intel.radius,
                risk: intel.riskModifier,
                type: intel.severity
            });

            // 3. Impact Assessment
            if (this._assessRouteImpact(intel)) {
                this._initiateProtocol(intel);
            }
        }

        /**
         * Checks if the threat intersects the current mission path.
         * @param {Object} threat
         */
        _assessRouteImpact(threat) {
            // Get current remaining path
            const currentPath = this.simulator.getRemainingPath();
            if (!currentPath || currentPath.length === 0) return false;

            // Simple intersection check: Is any point of the remaining path inside the threat radius?
            // Optimization: Check bounding box first? No, simple distance check is fast enough for <1000 points.

            // To be precise: We check distance from threat center to each path segment.
            // For MVP: Check distance to waypoints.

            const threatCenter = [threat.location.lat, threat.location.lng];
            const radiusKm = threat.radius; // radius is in km

            for (const point of currentPath) {
                const dist = this._getDist(threatCenter, point);
                if (dist < radiusKm) {
                    return true; // IMPACT CONFIRMED
                }
            }
            return false;
        }

        _initiateProtocol(threat) {
            // console.warn("[Overwatch] THREAT DETECTED ON ROUTE. INITIATING PROTOCOL.");

            // 1. Pause Simulation
            this.simulator.pause();

            // 2. Trigger UI Alert (via Custom Event or Callback)
            const event = new CustomEvent('overwatch-alert', {
                detail: {
                    threat: threat,
                    action: 'REROUTE_REQUIRED'
                }
            });
            window.dispatchEvent(event);

            // 3. Calculate Alternative (in background)
            // We'll let the UI confirm the reroute before applying it.
        }

        /**
         * Execute the re-route calculation and update the simulator.
         */
        executeReroute() {
            // Update Pathfinder Grid with all known threats
            // This is a bit inefficient (re-init entire grid), but safe.
            // Convert threats to the format Pathfinder expects
            const riskZones = this.activeThreats.map(t => ({
                coords: [t.location.lat, t.location.lng],
                radius: t.radius,
                risk: t.riskModifier
            }));

            // We must merge with static zones?
            // StrategicPathfinder.initializeGrid overwrites.
            // Ideally, we get existing zones first.
            // For now, let's assume Pathfinder keeps state or we pass just the new ones?
            // I'll update Pathfinder to have an `addRiskZone` method.

            riskZones.forEach(z => this.pathfinder.addRiskZone(z));

            // Recalculate Path
            const currentPos = this.simulator.state.position;
            // remainingRoute starts from currentRouteIndex (which is last visited or start)
            // So remainingRoute[0] is the *previous* or current target we just passed/are at?
            // MissionSimulator checks arrival at routeIndices[currentRouteIndex + 1].
            // So we are heading towards remainingRoute[1].
            const remainingRoute = this.simulator.getRemainingRouteTargets();

            // Safety check: Need at least 2 points to have a "next" target (Current, Next)
            if (remainingRoute.length < 2) return;

            // Generate new high-res path
            let newPath = [currentPos]; // Start from where we are

            // We need to construct newRouteIndices mapping.
            // The simulator expects routeIndices to map to the full route array.
            // Indices 0 to currentRouteIndex are already visited. We can ignore or mock them.
            // We only need to populate indices for currentRouteIndex + 1 onwards.

            const newRouteIndices = new Array(this.simulator.route.length).fill(-1);
            const baseRouteIndex = this.simulator.state.currentRouteIndex;

            // 1. From current Pos to Next Target (remainingRoute[1])
            // Note: remainingRoute[0] is route[currentRouteIndex].
            // We want to go to route[currentRouteIndex + 1] which is remainingRoute[1].

            const nextTarget = remainingRoute[1];
            const segment1 = this.pathfinder.findPath(currentPos, nextTarget.coords);

            // Remove first point of segment if it duplicates currentPos (usually pathfinder includes start)
            if (segment1 && segment1.length > 0) {
                 // Check distance to avoid duplicate points
                 // Using simple array check
                 // segment1[0] is currentPos.
                 segment1.shift();
            }

            newPath = newPath.concat(segment1);
            // The end of this segment corresponds to remainingRoute[1] (route[currentRouteIndex+1])
            newRouteIndices[baseRouteIndex + 1] = newPath.length - 1;

            // 2. From Next Target to Subsequent Targets
            for (let i = 1; i < remainingRoute.length - 1; i++) {
                const start = remainingRoute[i].coords;
                const end = remainingRoute[i+1].coords;
                const seg = this.pathfinder.findPath(start, end);

                if (seg && seg.length > 0) seg.shift(); // Avoid duplicates

                newPath = newPath.concat(seg);
                // Map to route index
                newRouteIndices[baseRouteIndex + 1 + i] = newPath.length - 1;
            }

            // Update Simulator with new path AND new indices
            this.simulator.updatePath(newPath, newRouteIndices);
            this.simulator.pause(); // Resume happens manually or here? Let's leave it paused for user to resume.

            // console.log("[Overwatch] New trajectory locked.");
            return true;
        }

        _getDist(c1, c2) {
            if (typeof Utils !== 'undefined') {
                return Utils.getDist(c1, c2);
            }
            // Fallback if Utils not loaded (Test env)
            const R = 6371;
            const dLat = (c2[0] - c1[0]) * Math.PI / 180;
            const dLon = (c2[1] - c1[1]) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(c1[0] * Math.PI / 180) * Math.cos(c2[0] * Math.PI / 180) *
                      Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return R * c;
        }
    }

    return Overwatch;

}));

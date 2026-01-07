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
            const remainingRoute = this.simulator.getRemainingRouteTargets();

            // Generate new high-res path
            let newPath = [currentPos]; // Start from where we are

            if (remainingRoute.length === 0) return; // Almost home

            // 1. From current Pos to Next Target
            // 2. From Next Target to Subsequent Targets

            const segment1 = this.pathfinder.findPath(currentPos, remainingRoute[0].coords);
            newPath = newPath.concat(segment1);

            for (let i = 0; i < remainingRoute.length - 1; i++) {
                const start = remainingRoute[i].coords;
                const end = remainingRoute[i+1].coords;
                const seg = this.pathfinder.findPath(start, end);
                if (i > 0) seg.shift(); // Avoid duplicates
                newPath = newPath.concat(seg);
            }

            // Update Simulator
            this.simulator.updatePath(newPath);
            this.simulator.pause(); // Resume happens manually or here? Let's leave it paused for user to resume.

            // console.log("[Overwatch] New trajectory locked.");
            return true;
        }

        _getDist(c1, c2) {
            // Haversine duplication (Utils class needed in Phase 2)
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

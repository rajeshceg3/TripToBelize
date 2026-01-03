/**
 * MissionSimulator.js
 *
 * The Sentinel Simulation Engine.
 * Executes a time-stepped simulation of the mission, calculating logistics,
 * risks, and generating dynamic events.
 */

class MissionSimulator {
    constructor(map, logisticsCore, tacticalOverlay, onUpdate, onEvent, onComplete) {
        this.map = map;
        this.logistics = logisticsCore;
        this.tacticalOverlay = tacticalOverlay;

        // Callbacks
        this.onUpdate = onUpdate; // function(state)
        this.onEvent = onEvent;   // function(eventMsg, type)
        this.onComplete = onComplete; // function(success)

        this.simulationSpeed = 100; // ms per tick (lower is faster)
        this.tickDurationMinutes = 15; // Sim time per tick

        this.timer = null;
        this.state = {
            status: 'IDLE', // IDLE, RUNNING, PAUSED, COMPLETED, FAILED
            startTime: new Date(),
            currentTime: new Date(),
            position: null, // LatLng
            supplies: 100,
            fatigue: 0,
            integrity: 100,
            currentLegIndex: 0,
            progressOnLeg: 0 // 0.0 to 1.0
        };

        this.route = [];
        this.marker = null;
        this.sensorCircle = null;
    }

    start(locations) {
        if (!locations || locations.length < 2) {
            console.error("MissionSimulator: Need at least 2 locations");
            return;
        }

        this.route = locations;
        this.state = {
            status: 'RUNNING',
            startTime: new Date(), // Sim start now
            currentTime: new Date(),
            position: locations[0].coords,
            supplies: 100,
            fatigue: 0,
            integrity: 100,
            currentLegIndex: 0,
            progressOnLeg: 0
        };

        this.createVisuals();
        this.onEvent("Mission Simulation Initialized. Systems Nominal.", "info");
        this.tick();
    }

    pause() {
        if (this.state.status === 'RUNNING') {
            this.state.status = 'PAUSED';
            clearTimeout(this.timer);
            this.onEvent("Simulation Paused.", "warning");
        } else if (this.state.status === 'PAUSED') {
            this.state.status = 'RUNNING';
            this.onEvent("Simulation Resumed.", "info");
            this.tick();
        }
    }

    abort() {
        this.state.status = 'FAILED';
        clearTimeout(this.timer);
        this.removeVisuals();
        this.onEvent("Mission Aborted by User.", "critical");
        if (this.onComplete) this.onComplete(false);
    }

    tick() {
        if (this.state.status !== 'RUNNING') return;

        // 1. Advance Time
        this.state.currentTime = new Date(this.state.currentTime.getTime() + this.tickDurationMinutes * 60000);

        // 2. Move
        const moved = this.moveUnit();
        if (!moved) {
            // Reached destination?
            this.complete();
            return;
        }

        // 3. Calculate Logistics
        this.updateLogistics();

        // 4. Check Triggers
        this.checkEvents();

        // 5. Update UI & Visuals
        this.updateVisuals();
        if (this.onUpdate) this.onUpdate(this.state);

        // 6. Check End Conditions
        if (this.state.integrity <= 0 || this.state.supplies <= 0) {
            this.fail("Critical Resource Depletion.");
            return;
        }

        // Schedule next tick
        this.timer = setTimeout(() => this.tick(), this.simulationSpeed);
    }

    moveUnit() {
        const startLoc = this.route[this.state.currentLegIndex];
        const endLoc = this.route[this.state.currentLegIndex + 1];

        if (!startLoc || !endLoc) return false; // End of route

        // Determine speed based on terrain of destination
        // (Simplified: using logic from LogisticsCore indirectly via fixed step)
        // Ideally speed varies, but for smooth sim we iterate progress

        // Progress increment
        // Distance between points
        const dist = this.getDist(startLoc.coords, endLoc.coords);

        // Handle zero distance edge case
        if (dist <= 0.001) {
             this.state.currentLegIndex++;
             this.state.progressOnLeg = 0;
             return true;
        }

        // Assume average speed 50km/h
        // Distance covered in tickDurationMinutes (e.g. 15min = 0.25h) -> 12.5km
        const kmPerTick = 50 * (this.tickDurationMinutes / 60);
        const progressInc = kmPerTick / dist;

        this.state.progressOnLeg += progressInc;

        if (this.state.progressOnLeg >= 1) {
            // Calculate how much we overshot
            // Distance traveled beyond waypoint
            const excessRatio = this.state.progressOnLeg - 1;
            const excessKm = excessRatio * dist;

            // Reached waypoint
            this.onEvent(`Reached Waypoint: ${endLoc.name}`, "success");
            this.state.currentLegIndex++;
            this.state.progressOnLeg = 0; // Temporarily reset

            // Check if it was the last point
            if (this.state.currentLegIndex >= this.route.length - 1) {
                return false; // Done
            }

            // Apply excess distance to the next leg
            const nextStart = this.route[this.state.currentLegIndex];
            const nextEnd = this.route[this.state.currentLegIndex + 1];

            if (nextStart && nextEnd) {
                const nextDist = this.getDist(nextStart.coords, nextEnd.coords);
                if (nextDist > 0.001) {
                    this.state.progressOnLeg = excessKm / nextDist;
                    // Cap it just in case we overshot multiple legs (simpler logic: clamp to 1)
                    if (this.state.progressOnLeg > 1) this.state.progressOnLeg = 1;
                }
            }
        }

        // Interpolate position
        const currentStart = this.route[this.state.currentLegIndex];
        const currentEnd = this.route[this.state.currentLegIndex + 1];

        if (currentStart && currentEnd) {
             this.state.position = this.interpolate(currentStart.coords, currentEnd.coords, this.state.progressOnLeg);
        }

        return true;
    }

    updateLogistics() {
        const currentLoc = this.route[this.state.currentLegIndex];
        const terrain = currentLoc ? (currentLoc.type_category || 'other') : 'other';

        const drain = this.logistics.calculateResourceDrain(terrain, this.tickDurationMinutes / 60);

        this.state.supplies = Math.max(0, this.state.supplies - drain.supplies);
        this.state.fatigue = Math.min(100, this.state.fatigue + drain.fatigue);
        this.state.integrity = Math.max(0, this.state.integrity - drain.integrity);
    }

    checkEvents() {
        const currentLoc = this.route[this.state.currentLegIndex];
        if (!currentLoc) return;

        const dynamicRisk = this.logistics.getDynamicRisk(currentLoc, this.state.currentTime);

        if (this.logistics.shouldTriggerEvent(dynamicRisk)) {
            // Generate Event
            const events = [
                { msg: "Uneven terrain caused vehicle damage.", type: "warning", damage: { integrity: 5 } },
                { msg: "Wildlife encounter delayed progress.", type: "warning", damage: { supplies: 2, fatigue: 5 } },
                { msg: "Navigation error corrected.", type: "info", damage: { supplies: 1 } },
                { msg: "Severe weather alert!", type: "critical", damage: { integrity: 8, fatigue: 8 } }
            ];

            const evt = events[Math.floor(Math.random() * events.length)];
            this.onEvent(evt.msg, evt.type);

            if (evt.damage) {
                if (evt.damage.integrity) this.state.integrity -= evt.damage.integrity;
                if (evt.damage.supplies) this.state.supplies -= evt.damage.supplies;
                if (evt.damage.fatigue) this.state.fatigue += evt.damage.fatigue;
            }
        }
    }

    complete() {
        this.state.status = 'COMPLETED';
        this.removeVisuals();
        this.onEvent("Mission Accomplished.", "success");
        if (this.onComplete) this.onComplete(true);
    }

    fail(reason) {
        this.state.status = 'FAILED';
        clearTimeout(this.timer);
        this.removeVisuals();
        this.onEvent(`Mission Failed: ${reason}`, "critical");
        if (this.onComplete) this.onComplete(false);
    }

    // Helpers

    getDist(c1, c2) {
        const R = 6371;
        const dLat = (c2[0] - c1[0]) * Math.PI / 180;
        const dLon = (c2[1] - c1[1]) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(c1[0] * Math.PI / 180) * Math.cos(c2[0] * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    interpolate(p1, p2, t) {
        return [
            p1[0] + (p2[0] - p1[0]) * t,
            p1[1] + (p2[1] - p1[1]) * t
        ];
    }

    createVisuals() {
        if (!this.map) return;

        const icon = L.divIcon({
            className: 'sim-unit-marker',
            html: '<div class="unit-pulse"></div>',
            iconSize: [20, 20]
        });

        this.marker = L.marker(this.state.position, { icon: icon, zIndexOffset: 1000 }).addTo(this.map);

        this.sensorCircle = L.circle(this.state.position, {
            radius: 5000, // 5km sensor range
            color: '#7fffd4',
            weight: 1,
            fillOpacity: 0.1,
            dashArray: '5, 5'
        }).addTo(this.map);
    }

    updateVisuals() {
        if (this.marker) this.marker.setLatLng(this.state.position);
        if (this.sensorCircle) this.sensorCircle.setLatLng(this.state.position);
    }

    removeVisuals() {
        if (this.marker) {
            this.marker.remove();
            this.marker = null;
        }
        if (this.sensorCircle) {
            this.sensorCircle.remove();
            this.sensorCircle = null;
        }
    }
}

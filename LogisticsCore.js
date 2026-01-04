/**
 * LogisticsCore.js
 *
 * The brains of the operation. This module handles all mission-critical calculations,
 * risk assessments, and logistical planning. It is designed to be purely functional
 * and decoupled from the presentation layer.
 */

(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        // Node.js/CommonJS
        module.exports = factory();
    } else {
        // Browser globals
        root.LogisticsCore = factory();
    }
}(typeof self !== 'undefined' ? self : this, function() {

    class LogisticsCore {
        constructor() {
            this.baseSpeed = 50; // Average travel speed in km/h on mixed terrain
            this.terrainModifiers = {
                'marine': 0.6, // Slower on water
                'nature': 0.8, // Slower on unpaved roads/jungle
                'ruins': 0.9, // Slightly slower on access roads
                'other': 1.0
            };

            // Simulating live weather feeds
            this.currentWeatherRisk = Math.floor(Math.random() * 3) + 1; // 1-3 scale
        }

        /**
         * Calculates resource drain (Supplies, Fatigue, Integrity) for a given duration and terrain.
         * @param {string} terrainType - The type of terrain (marine, nature, ruins, other).
         * @param {number} durationHours - Duration of the activity in hours.
         * @returns {Object} - { supplies: number, fatigue: number, integrity: number } (Values are drain amounts)
         */
        calculateResourceDrain(terrainType, durationHours) {
            // Base drain rates per hour
            const baseSupplies = 2.0;
            const baseFatigue = 1.5;
            const baseIntegrity = 0.5;

            let multiplier = 1.0;
            switch (terrainType) {
                case 'nature': multiplier = 1.5; break; // Jungle is tiring
                case 'marine': multiplier = 1.2; break; // Sea is moderate
                case 'ruins': multiplier = 1.1; break; // Hiking ruins
                default: multiplier = 1.0;
            }

            // Integrity drains faster in harsh terrain
            let integrityMultiplier = terrainType === 'ruins' || terrainType === 'nature' ? 1.5 : 1.0;

            return {
                supplies: parseFloat((baseSupplies * multiplier * durationHours).toFixed(2)),
                fatigue: parseFloat((baseFatigue * multiplier * durationHours).toFixed(2)),
                integrity: parseFloat((baseIntegrity * multiplier * integrityMultiplier * durationHours).toFixed(2))
            };
        }

        /**
         * Calculates dynamic risk based on location and time of day.
         * @param {Object} location - The location object.
         * @param {Date} time - The current simulation time.
         * @returns {number} - Dynamic risk score (1-100).
         */
        getDynamicRisk(location, time) {
            const baseRisk = location.risk_level || 1;
            const hour = time.getHours();
            const isNight = hour < 6 || hour > 18;

            let riskScore = baseRisk * 10; // Base 1-5 to 10-50

            // Night operations are significantly riskier in nature/marine
            if (isNight && (location.type_category === 'nature' || location.type_category === 'marine')) {
                riskScore *= 1.5;
            }

            // Weather impact
            riskScore *= (1 + (this.currentWeatherRisk * 0.1));

            return Math.min(Math.round(riskScore), 100);
        }

        /**
         * Determines if a random event should trigger.
         * @param {number} dynamicRisk - Current risk score (0-100).
         * @returns {boolean} - True if event triggers.
         */
        shouldTriggerEvent(dynamicRisk) {
            // Base probability 1% per tick, scales with risk
            const probability = 0.01 + (dynamicRisk / 1000);
            return Math.random() < probability;
        }

        /**
         * Calculates the raw duration in hours for a given route.
         * @param {Array} locations - The list of location objects in the route.
         * @param {number} totalDistance - Total distance in km.
         * @returns {number} - Duration in hours.
         */
        calculateDurationHours(locations, totalDistance) {
            if (!locations || locations.length < 2) return 0;

            // Calculate weighted speed based on terrain composition
            let totalWeightedSpeed = 0;
            locations.forEach(loc => {
                const type = loc.type_category || 'other';
                const modifier = this.terrainModifiers[type] || 1.0;
                totalWeightedSpeed += (this.baseSpeed * modifier);
            });

            const avgSpeed = totalWeightedSpeed / locations.length;
            const travelHours = totalDistance / avgSpeed;

            // Add 1.5 hour overhead per stop (excluding start/end) for "boots on ground" time
            // If there are 2 locations (start/end), overhead is 0.
            const stopOverhead = Math.max(0, (locations.length - 2) * 1.5);

            return travelHours + stopOverhead;
        }

        /**
         * Calculates the estimated time of arrival (ETA) for a given route.
         * @param {Array} locations - The list of location objects in the route.
         * @param {number} totalDistance - Total distance in km.
         * @returns {string} - Formatted duration string (e.g., "4h 30m").
         */
        calculateETA(locations, totalDistance) {
            const totalHours = this.calculateDurationHours(locations, totalDistance);
            if (totalHours === 0) return "N/A";

            const h = Math.floor(totalHours);
            const m = Math.round((totalHours - h) * 60);

            return `${h}h ${m}m`;
        }

        /**
         * Estimates the total resource cost for a mission profile without running the simulation.
         * @param {Array} locations - The list of location objects.
         * @param {number} totalDistance - Total distance in km.
         * @returns {Object} - { supplies: number, fatigue: number, integrity: number }
         */
        estimateMissionCost(locations, totalDistance) {
            const totalHours = this.calculateDurationHours(locations, totalDistance);

            // Calculate average terrain drain
            // We simulate the route by averaging the terrain types
            let totalSupplies = 0;
            let totalFatigue = 0;
            let totalIntegrity = 0;

            if (locations.length < 2) return { supplies: 0, fatigue: 0, integrity: 0 };

            // Approximate the time spent in each leg
            // Simplified: Divide total time by number of legs
            const legs = locations.length - 1;
            const hoursPerLeg = totalHours / legs;

            for (let i = 0; i < legs; i++) {
                // Use the destination terrain for the leg (conservative estimate)
                const targetLoc = locations[i+1];
                const type = targetLoc.type_category || 'other';

                const drain = this.calculateResourceDrain(type, hoursPerLeg);

                totalSupplies += drain.supplies;
                totalFatigue += drain.fatigue;
                totalIntegrity += drain.integrity;
            }

            return {
                supplies: parseFloat(totalSupplies.toFixed(1)),
                fatigue: parseFloat(totalFatigue.toFixed(1)),
                integrity: parseFloat(totalIntegrity.toFixed(1))
            };
        }

        /**
         * Calculates the composite risk score for the mission.
         * Formula: (Max Location Risk + Avg Location Risk) / 2 * Weather Factor
         * @param {Array} locations - List of location objects.
         * @returns {Object} - { score: number (1-100), label: string, color: string }
         */
        assessRisk(locations) {
            if (!locations || locations.length === 0) return { score: 0, label: "LOW", color: "#7fffd4" };

            const risks = locations.map(l => l.risk_level || 1);
            const maxRisk = Math.max(...risks);
            const avgRisk = risks.reduce((a, b) => a + b, 0) / risks.length;

            // Risk calculation (Base 1-5 scale mapped to 100)
            // A level 5 location is a significant multiplier
            let rawScore = ((maxRisk * 1.5) + (avgRisk * 0.5)) * 10;

            // Apply weather modifier (1.0 to 1.3)
            const weatherMod = 1 + (this.currentWeatherRisk * 0.1);
            let finalScore = Math.min(Math.round(rawScore * weatherMod), 100);

            let label = "LOW";
            let color = "#7fffd4"; // Aquamarine

            if (finalScore > 75) {
                label = "CRITICAL";
                color = "#ff6b6b"; // Red
            } else if (finalScore > 45) {
                label = "CAUTION";
                color = "#ffd93d"; // Yellow
            }

            return { score: finalScore, label, color };
        }

        /**
         * Validates if the provided gear matches the mission requirements.
         * @param {Array} locations - List of selected locations.
         * @param {Array} equippedGear - List of gear strings selected by user.
         * @returns {Object} - { valid: boolean, missing: Array }
         */
        validateLoadout(locations, equippedGear) {
            const missing = new Set();

            locations.forEach(loc => {
                if (loc.required_gear) {
                    loc.required_gear.forEach(item => {
                        if (!equippedGear.includes(item)) {
                            missing.add(item);
                        }
                    });
                }
            });

            const missingArray = Array.from(missing);
            return {
                valid: missingArray.length === 0,
                missing: missingArray
            };
        }

        /**
         * Generates a unique gear list required for the current selection.
         * @param {Array} locations
         */
        getRequiredGearList(locations) {
            const req = new Set();
            locations.forEach(loc => {
                if (loc.required_gear) {
                    loc.required_gear.forEach(item => req.add(item));
                }
            });
            return Array.from(req);
        }
    }

    return LogisticsCore;
}));

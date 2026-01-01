/**
 * LogisticsCore.js
 *
 * The brains of the operation. This module handles all mission-critical calculations,
 * risk assessments, and logistical planning. It is designed to be purely functional
 * and decoupled from the presentation layer.
 */

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
     * Calculates the estimated time of arrival (ETA) for a given route.
     * @param {Array} locations - The list of location objects in the route.
     * @param {number} totalDistance - Total distance in km.
     * @returns {string} - Formatted duration string (e.g., "4h 30m").
     */
    calculateETA(locations, totalDistance) {
        if (!locations || locations.length < 2) return "N/A";

        // Calculate weighted speed based on terrain composition
        let totalWeightedSpeed = 0;
        locations.forEach(loc => {
            const type = loc.type_category || 'other';
            const modifier = this.terrainModifiers[type] || 1.0;
            totalWeightedSpeed += (this.baseSpeed * modifier);
        });

        const avgSpeed = totalWeightedSpeed / locations.length;
        const hours = totalDistance / avgSpeed;

        // Add 1 hour overhead per stop for "boots on ground" time
        const stopOverhead = (locations.length - 2) * 1.5;

        const totalHours = hours + stopOverhead;
        const h = Math.floor(totalHours);
        const m = Math.round((totalHours - h) * 60);

        return `${h}h ${m}m`;
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

/**
 * DecisionSupport.js
 *
 * Tactical Decision Support System (TDSS)
 * Manages mission scenario persistence, analysis, and retrieval.
 */

(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.DecisionSupport = factory();
    }
}(typeof self !== 'undefined' ? self : this, function() {

    class DecisionSupport {
        constructor(logisticsCore) {
            this.logistics = logisticsCore;
            this.storageKey = 'trip_to_belize_scenarios';
        }

        /**
         * Saves a new scenario to local storage.
         * @param {string} name - User defined name.
         * @param {Array} locations - Array of location objects.
         * @param {Array} gear - Array of selected gear strings.
         * @param {Object} metrics - Pre-calculated metrics { totalDistance, etc }
         * @returns {Object} The saved scenario object.
         */
        saveScenario(name, locations, gear, metrics) {
            if (!name || !locations || locations.length < 2) {
                console.error("Invalid scenario data");
                return null;
            }

            // Perform deep analysis for the record
            const distance = metrics.totalDistance || 0;
            const cost = this.logistics.estimateMissionCost(locations, distance);
            const risk = this.logistics.assessRisk(locations);
            const duration = this.logistics.calculateDurationHours(locations, distance);

            const scenario = {
                id: this._generateUUID(),
                timestamp: Date.now(),
                name: name,
                locations: JSON.parse(JSON.stringify(locations)), // Deep copy
                gear: [...gear],
                analysis: {
                    distance: distance,
                    durationHours: duration,
                    riskScore: risk.score,
                    riskLabel: risk.label,
                    riskColor: risk.color,
                    predictedSupplies: cost.supplies,
                    predictedFatigue: cost.fatigue,
                    predictedIntegrity: cost.integrity
                }
            };

            const archives = this.getScenarios();
            archives.unshift(scenario); // Add to top
            this._saveToStorage(archives);

            return scenario;
        }

        /**
         * Retrieves all saved scenarios.
         * @returns {Array} List of scenarios.
         */
        getScenarios() {
            try {
                const data = localStorage.getItem(this.storageKey);
                return data ? JSON.parse(data) : [];
            } catch (e) {
                console.error("Failed to load scenarios", e);
                return [];
            }
        }

        /**
         * Deletes a scenario by ID.
         * @param {string} id
         */
        deleteScenario(id) {
            let archives = this.getScenarios();
            archives = archives.filter(s => s.id !== id);
            this._saveToStorage(archives);
        }

        /**
         * Loads a specific scenario.
         * @param {string} id
         * @returns {Object|null}
         */
        getScenario(id) {
            const archives = this.getScenarios();
            return archives.find(s => s.id === id) || null;
        }

        _saveToStorage(data) {
            try {
                localStorage.setItem(this.storageKey, JSON.stringify(data));
            } catch (e) {
                console.error("Failed to save to storage", e);
                alert("Storage limit reached. Cannot save tactical data.");
            }
        }

        _generateUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
    }

    return DecisionSupport;
}));

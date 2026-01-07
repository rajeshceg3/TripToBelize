/**
 * TelemetryStream.js
 *
 * "Eyes in the Sky."
 *
 * Simulates a high-bandwidth tactical data link providing real-time
 * intelligence updates (Weather, Traffic, Hostile Activity) to the
 * Command Center.
 */

(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.TelemetryStream = factory();
    }
}(typeof self !== 'undefined' ? self : this, function() {

    class TelemetryStream {
        constructor() {
            this.subscribers = [];
            this.active = false;
            this.intervalId = null;
            this.eventTypes = [
                { type: 'WEATHER', severity: 'WARNING', label: 'Flash Flood Warning' },
                { type: 'TRAFFIC', severity: 'CAUTION', label: 'Road Obstruction' },
                { type: 'INTEL', severity: 'CRITICAL', label: 'High-Value Target Activity' },
                { type: 'ENV', severity: 'WARNING', label: 'Seismic Tremor Detected' }
            ];
        }

        /**
         * Subscribe to the data stream.
         * @param {Function} callback - Function(data)
         */
        subscribe(callback) {
            this.subscribers.push(callback);
        }

        /**
         * Unsubscribe from the stream.
         * @param {Function} callback
         */
        unsubscribe(callback) {
            this.subscribers = this.subscribers.filter(cb => cb !== callback);
        }

        /**
         * Start the simulation stream.
         */
        connect() {
            if (this.active) return;
            this.active = true;
            // console.log("[Telemetry] Link Established. Encryption: AES-256.");

            // Randomly trigger events every 10-30 seconds
            this._scheduleNextEvent();
        }

        /**
         * Stop the stream.
         */
        disconnect() {
            this.active = false;
            if (this.intervalId) clearTimeout(this.intervalId);
            // console.log("[Telemetry] Link Terminated.");
        }

        _scheduleNextEvent() {
            if (!this.active) return;

            // Random interval between 10s and 30s
            const delay = Math.random() * 20000 + 10000;

            this.intervalId = setTimeout(() => {
                this._emitRandomEvent();
                this._scheduleNextEvent();
            }, delay);
        }

        _emitRandomEvent() {
            const template = this.eventTypes[Math.floor(Math.random() * this.eventTypes.length)];

            // Generate simulated coordinates (approx Belize bounds)
            // Lat: 16.0 - 18.5
            // Lng: -89.2 - -87.4
            const lat = 16.0 + (Math.random() * 2.5);
            const lng = -89.2 + (Math.random() * 1.8);

            const eventData = {
                id: Date.now(),
                timestamp: new Date(),
                category: template.type,
                severity: template.severity, // WARNING, CAUTION, CRITICAL
                message: template.label,
                location: { lat, lng },
                radius: Math.floor(Math.random() * 15) + 5, // 5-20km impact radius
                riskModifier: Math.floor(Math.random() * 50) + 20 // Added risk score
            };

            this._notify(eventData);
        }

        _notify(data) {
            this.subscribers.forEach(cb => cb(data));
        }
    }

    return TelemetryStream;

}));

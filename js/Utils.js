/**
 * Utils.js
 *
 * Shared Tactical Utilities.
 * Centralizes math, formatting, and common helpers to ensure consistency across modules.
 */

(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.Utils = factory();
    }
}(typeof self !== 'undefined' ? self : this, function() {

    const Utils = {
        /**
         * Calculates the Great Circle distance between two coordinates (Haversine formula).
         * @param {Array} c1 - [lat, lng]
         * @param {Array} c2 - [lat, lng]
         * @returns {number} Distance in Kilometers
         */
        getDist: function(c1, c2) {
            if (!c1 || !c2) return 0;
            const R = 6371; // Earth radius in km
            const dLat = (c2[0] - c1[0]) * Math.PI / 180;
            const dLon = (c2[1] - c1[1]) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(c1[0] * Math.PI / 180) * Math.cos(c2[0] * Math.PI / 180) *
                      Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return R * c;
        },

        /**
         * Clamps a number between min and max.
         * @param {number} num
         * @param {number} min
         * @param {number} max
         * @returns {number}
         */
        clamp: function(num, min, max) {
            return Math.min(Math.max(num, min), max);
        },

        /**
         * Checks if the user prefers reduced motion.
         * @returns {boolean}
         */
        prefersReducedMotion: function() {
            return typeof window !== 'undefined' &&
                   window.matchMedia &&
                   window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        },

        /**
         * Displays a tactical notification (Toast).
         * @param {string} message
         * @param {string} type - 'info', 'warning', 'critical', 'success'
         */
        showToast: function(message, type = 'info') {
            if (typeof document === 'undefined') {
                console.log(`[${type.toUpperCase()}] ${message}`);
                return;
            }

            let container = document.getElementById('toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'toast-container';
                container.style.cssText = "position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 2000; display: flex; flex-direction: column; gap: 10px; pointer-events: none;";
                document.body.appendChild(container);
            }

            const toast = document.createElement('div');
            toast.className = `glass-panel toast-msg ${type}`;
            toast.style.cssText = "pointer-events: auto; padding: 12px 24px; border-left: 4px solid var(--glow-cyan); background: rgba(0, 26, 41, 0.95); color: #fff; font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); opacity: 0; transform: translateY(20px); transition: all 0.3s ease;";

            if (type === 'warning') toast.style.borderLeftColor = 'var(--warning-gold)';
            if (type === 'critical') toast.style.borderLeftColor = 'var(--danger-red)';
            if (type === 'success') toast.style.borderLeftColor = 'var(--glow-cyan)';

            toast.textContent = message;

            container.appendChild(toast);

            // Animate In
            requestAnimationFrame(() => {
                toast.style.opacity = '1';
                toast.style.transform = 'translateY(0)';
            });

            // Remove after delay
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    if (toast.parentNode) toast.parentNode.removeChild(toast);
                }, 300);
            }, 4000);
        }
    };

    return Utils;
}));

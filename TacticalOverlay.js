/**
 * TacticalOverlay.js
 *
 * Provides the visual layer for the "Command & Control" mode.
 * Renders tactical grids, range rings, and threat zones on the Leaflet map.
 */

class TacticalOverlay {
    constructor(map) {
        this.map = map;
        this.layerGroup = L.layerGroup();
        this.isVisible = false;

        // Configuration for the tactical grid
        this.gridSpacing = 0.1; // roughly 11km
        this.gridColor = 'rgba(127, 255, 212, 0.15)';
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
        return this.isVisible;
    }

    show() {
        if (this.isVisible) return;
        this.layerGroup.addTo(this.map);
        this.renderGrid();
        this.renderRangeRings();
        this.isVisible = true;

        // Use CSS class for style changes
        document.getElementById('map').classList.add('tactical-mode-active');
    }

    hide() {
        if (!this.isVisible) return;
        this.layerGroup.clearLayers();
        this.layerGroup.removeFrom(this.map);
        this.isVisible = false;

        // Remove CSS class
        document.getElementById('map').classList.remove('tactical-mode-active');
    }

    renderGrid() {
        const bounds = this.map.getBounds();
        const north = bounds.getNorth();
        const south = bounds.getSouth();
        const west = bounds.getWest();
        const east = bounds.getEast();

        // Draw vertical lines
        for (let lng = Math.ceil(west / this.gridSpacing) * this.gridSpacing; lng <= east; lng += this.gridSpacing) {
            L.polyline([[south, lng], [north, lng]], {
                color: this.gridColor,
                weight: 1,
                dashArray: '5, 5'
            }).addTo(this.layerGroup);
        }

        // Draw horizontal lines
        for (let lat = Math.ceil(south / this.gridSpacing) * this.gridSpacing; lat <= north; lat += this.gridSpacing) {
            L.polyline([[lat, west], [lat, east]], {
                color: this.gridColor,
                weight: 1,
                dashArray: '5, 5'
            }).addTo(this.layerGroup);
        }
    }

    renderRangeRings() {
        const center = [17.1899, -88.4976]; // Belize center
        const rings = [20000, 50000, 80000]; // 20km, 50km, 80km

        rings.forEach(radius => {
            L.circle(center, {
                radius: radius,
                color: 'rgba(255, 107, 107, 0.2)', // Red-ish
                weight: 1,
                fill: false,
                dashArray: '10, 10'
            }).addTo(this.layerGroup);
        });
    }

    // Call this when map moves to update grid if we were doing dynamic grid
    // For now, we render grid based on initial view or current view when toggled on
    update() {
        if (this.isVisible) {
            this.layerGroup.clearLayers();
            this.renderGrid();
            this.renderRangeRings();
        }
    }
}

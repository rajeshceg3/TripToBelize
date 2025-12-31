class ExpeditionManager {
    constructor() {
        this.selectedLocations = [];
        this.storageKey = 'tripToBelize_expedition';
        this.load();
    }

    // Load expedition from local storage
    load() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                this.selectedLocations = JSON.parse(stored);
                console.log("ExpeditionManager: Loaded", this.selectedLocations.length, "locations");
            }
        } catch (e) {
            console.error("ExpeditionManager: Failed to load", e);
            this.selectedLocations = [];
        }
    }

    // Save expedition to local storage
    save() {
        try {
            console.log("ExpeditionManager: Saving", this.selectedLocations.length, "locations");
            localStorage.setItem(this.storageKey, JSON.stringify(this.selectedLocations));
            // Dispatch a custom event so other components can react
            window.dispatchEvent(new CustomEvent('expeditionUpdated', {
                detail: { locations: this.selectedLocations }
            }));
        } catch (e) {
            console.error("ExpeditionManager: Save failed", e);
        }
    }

    // Add a location to the expedition
    addLocation(location) {
        console.log("ExpeditionManager: Adding", location.name);
        // Prevent duplicates
        if (!this.selectedLocations.some(l => l.name === location.name)) {
            this.selectedLocations.push(location);
            this.save();
            return true;
        }
        return false;
    }

    // Remove a location from the expedition
    removeLocation(locationName) {
        console.log("ExpeditionManager: Removing", locationName);
        this.selectedLocations = this.selectedLocations.filter(l => l.name !== locationName);
        this.save();
    }

    // Check if a location is already selected
    isSelected(locationName) {
        return this.selectedLocations.some(l => l.name === locationName);
    }

    // Get the current list
    getExpedition() {
        return this.selectedLocations;
    }

    // Calculate total distance in kilometers using Haversine formula
    calculateTotalDistance() {
        if (this.selectedLocations.length < 2) return 0;

        let totalDist = 0;
        for (let i = 0; i < this.selectedLocations.length - 1; i++) {
            const loc1 = this.selectedLocations[i];
            const loc2 = this.selectedLocations[i+1];
            totalDist += this.getDistanceFromLatLonInKm(
                loc1.coords[0], loc1.coords[1],
                loc2.coords[0], loc2.coords[1]
            );
        }
        return Math.round(totalDist * 10) / 10; // Round to 1 decimal
    }

    // Helper: Haversine distance
    getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the earth in km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    }

    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    // Analyze the expedition composition
    analyzeComposition() {
        console.log("ExpeditionManager: Analyzing composition for", this.selectedLocations.length, "items");
        if (this.selectedLocations.length === 0) return null;

        const counts = {};
        this.selectedLocations.forEach(l => {
            const type = l.type_category || 'other';
            counts[type] = (counts[type] || 0) + 1;
        });

        // Find dominant type
        let dominantType = '';
        let maxCount = 0;
        for (const type in counts) {
            if (counts[type] > maxCount) {
                maxCount = counts[type];
                dominantType = type;
            }
        }

        return {
            totalLocations: this.selectedLocations.length,
            composition: counts,
            dominantType: dominantType,
            totalDistance: this.calculateTotalDistance()
        };
    }

    // Clear the expedition
    clear() {
        console.log("ExpeditionManager: Clearing");
        this.selectedLocations = [];
        this.save();
    }
}

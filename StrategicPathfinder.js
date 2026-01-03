/**
 * StrategicPathfinder.js
 *
 * "Project OVERWATCH" - Autonomous Route Optimization Module.
 *
 * This module implements A* pathfinding on a weighted grid to calculate optimal
 * mission routes based on terrain risk, weather, and distance.
 */

class StrategicPathfinder {
    constructor(mapBounds, resolution = 0.01) {
        this.bounds = mapBounds; // { north, south, east, west }
        this.resolution = resolution; // Decimal degrees approx grid size
        this.grid = {}; // Sparse grid: 'lat,lng' -> { cost: number, risk: number }
        this.riskZones = []; // Initialize riskZones
    }

    /**
     * Initializes the grid with base costs and risk zones.
     * @param {Array} riskZones - List of { coords: [lat, lng], radius: m, risk: 1-10 }
     */
    initializeGrid(riskZones) {
        // In a real scenario, we would rasterize the entire map.
        // For performance, we generate nodes on demand or use a simplified graph.
        // Here we simulate a pre-processed grid.
        this.riskZones = riskZones || [];
    }

    /**
     * Calculates the movement cost for a specific node.
     * @param {number} lat
     * @param {number} lng
     * @returns {number} Cost (1.0 is base, higher is slower/riskier)
     */
    getCost(lat, lng) {
        let baseCost = 1.0;

        // Check proximity to risk zones
        for (const zone of this.riskZones) {
            const dist = this.getDist([lat, lng], zone.coords);
            if (dist < zone.radius) {
                // Closer to center = higher risk
                const factor = 1 - (dist / zone.radius);
                baseCost += (zone.risk * factor);
            }
        }

        return baseCost;
    }

    /**
     * Finds the optimal path between two points using A*.
     * @param {Array} start - [lat, lng]
     * @param {Array} end - [lat, lng]
     * @returns {Array} List of [lat, lng] waypoints
     */
    findPath(start, end) {
        // Simplified A* for the prototype
        // 1. Define open and closed sets
        // 2. Heuristic: Euclidean distance

        // For the sake of the "MVP" and memory constraints, if start/end are too far,
        // we might just return direct line if no risk zones intervene.

        // However, to demonstrate "Strategic" value, we must show it avoiding a zone.

        const openSet = new PriorityQueue();
        const startNode = this.nodeKey(start[0], start[1]);

        const gScore = {}; // Cost from start
        gScore[startNode] = 0;

        const fScore = {}; // Estimated total cost
        fScore[startNode] = this.heuristic(start, end);

        const cameFrom = {};

        openSet.enqueue(start, fScore[startNode]);
        const visited = new Set();

        let iters = 0;
        const maxIters = 2000; // Safety break

        while (!openSet.isEmpty()) {
            iters++;
            if (iters > maxIters) {
                console.warn("Pathfinding timed out, reverting to direct route.");
                return [start, end];
            }

            const current = openSet.dequeue();
            const currentKey = this.nodeKey(current[0], current[1]);

            if (this.isGoal(current, end)) {
                return this.reconstructPath(cameFrom, current);
            }

            visited.add(currentKey);

            const neighbors = this.getNeighbors(current);
            for (const neighbor of neighbors) {
                const neighborKey = this.nodeKey(neighbor[0], neighbor[1]);
                if (visited.has(neighborKey)) continue;

                // Distance cost + Terrain/Risk cost
                const dist = this.getDist(current, neighbor); // approx km
                const riskCost = this.getCost(neighbor[0], neighbor[1]);

                // Weighting: 1km = 1 cost unit base.
                // Risk multiplies the "effective distance".
                const tentativeG = gScore[currentKey] + (dist * riskCost);

                if (tentativeG < (gScore[neighborKey] || Infinity)) {
                    cameFrom[neighborKey] = current;
                    gScore[neighborKey] = tentativeG;
                    fScore[neighborKey] = tentativeG + this.heuristic(neighbor, end);

                    // Priority Queue update is tricky without a specialized data structure,
                    // so we just push again (lazy deletion).
                    openSet.enqueue(neighbor, fScore[neighborKey]);
                }
            }
        }

        return [start, end]; // Fallback
    }

    getNeighbors(coords) {
        const [lat, lng] = coords;
        const r = this.resolution;
        // 8-way connectivity
        return [
            [lat+r, lng], [lat-r, lng],
            [lat, lng+r], [lat, lng-r],
            [lat+r, lng+r], [lat+r, lng-r],
            [lat-r, lng+r], [lat-r, lng-r]
        ];
    }

    heuristic(a, b) {
        return this.getDist(a, b);
    }

    isGoal(current, end) {
        // Within half resolution distance
        return this.getDist(current, end) < (this.resolution * 111 / 2); // approx km conversion
    }

    reconstructPath(cameFrom, current) {
        const totalPath = [current];
        let currKey = this.nodeKey(current[0], current[1]);

        while (currKey in cameFrom) {
            current = cameFrom[currKey];
            currKey = this.nodeKey(current[0], current[1]);
            totalPath.unshift(current);
        }
        return totalPath;
    }

    nodeKey(lat, lng) {
        return `${lat.toFixed(4)},${lng.toFixed(4)}`;
    }

    // Haversine formula
    getDist(c1, c2) {
        const R = 6371; // km
        const dLat = (c2[0] - c1[0]) * Math.PI / 180;
        const dLon = (c2[1] - c1[1]) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(c1[0] * Math.PI / 180) * Math.cos(c2[0] * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
}

// Minimal Priority Queue for A*
class PriorityQueue {
    constructor() {
        this.elements = [];
    }

    enqueue(item, priority) {
        this.elements.push({ item, priority });
        this.elements.sort((a, b) => a.priority - b.priority);
    }

    dequeue() {
        return this.elements.shift().item;
    }

    isEmpty() {
        return this.elements.length === 0;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = StrategicPathfinder;
}

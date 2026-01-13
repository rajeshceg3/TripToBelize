/**
 * StrategicPathfinder.js
 *
 * "Project OVERWATCH" - Autonomous Route Optimization Module.
 *
 * This module implements A* pathfinding on a weighted grid to calculate optimal
 * mission routes based on terrain risk, weather, and distance.
 */

(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.StrategicPathfinder = factory();
    }
}(typeof self !== 'undefined' ? self : this, function() {

    // Optimized Binary Heap Priority Queue for A*
    // Performance: O(log N) operations vs O(N log N) for array sort
    class PriorityQueue {
        constructor() {
            this.elements = [];
        }

        enqueue(item, priority) {
            this.elements.push({ item, priority });
            this.bubbleUp(this.elements.length - 1);
        }

        dequeue() {
            if (this.isEmpty()) return null;
            const min = this.elements[0];
            const end = this.elements.pop();
            if (this.elements.length > 0) {
                this.elements[0] = end;
                this.sinkDown(0);
            }
            return min.item;
        }

        isEmpty() {
            return this.elements.length === 0;
        }

        bubbleUp(n) {
            const element = this.elements[n];
            while (n > 0) {
                const parentN = Math.floor((n + 1) / 2) - 1;
                const parent = this.elements[parentN];
                if (element.priority >= parent.priority) break;
                this.elements[parentN] = element;
                this.elements[n] = parent;
                n = parentN;
            }
        }

        sinkDown(n) {
            const length = this.elements.length;
            const element = this.elements[n];
            while (true) {
                let child2N = (n + 1) * 2;
                let child1N = child2N - 1;
                let swap = null;

                if (child1N < length) {
                    const child1 = this.elements[child1N];
                    if (child1.priority < element.priority) {
                        swap = child1N;
                    }
                }

                if (child2N < length) {
                    const child2 = this.elements[child2N];
                    const child1 = this.elements[child1N];
                    if (child2.priority < (swap === null ? element.priority : child1.priority)) {
                        swap = child2N;
                    }
                }

                if (swap === null) break;
                this.elements[n] = this.elements[swap];
                this.elements[swap] = element;
                n = swap;
            }
        }
    }

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
         * Dynamically adds a new risk zone to the grid.
         * @param {Object} zone - { coords: [lat, lng], radius: m, risk: 1-10 }
         */
        addRiskZone(zone) {
            this.riskZones.push(zone);
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
            const maxIters = 5000; // Increased safety break due to better performance

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
            if (typeof Utils !== 'undefined') {
                return Utils.getDist(c1, c2);
            }
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

    return StrategicPathfinder;
}));

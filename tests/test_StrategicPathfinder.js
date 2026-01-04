const StrategicPathfinder = global.StrategicPathfinder;

describe('Strategic Pathfinder Module', () => {

    // Test Bounds (Approx Belize Area)
    const bounds = { north: 18.5, south: 15.8, east: -87.5, west: -89.5 };

    it('should initialize correctly', () => {
        const pf = new StrategicPathfinder(bounds);
        expect(pf.grid).toBeTruthy();
    });

    it('should calculate distance correctly (Haversine)', () => {
        const pf = new StrategicPathfinder(bounds);
        const p1 = [17.0, -88.0];
        const p2 = [17.0, -89.0];
        // 1 degree lat approx 111km at equator, long varies. At 17deg N:
        // cos(17) = 0.956. 111 * 0.956 = 106km approx.
        const dist = pf.getDist(p1, p2);
        expect(dist).toBeGreaterThan(100);
        expect(dist).toBeLessThan(110);
    });

    it('should increase cost near risk zones', () => {
        const pf = new StrategicPathfinder(bounds);
        const riskZone = { coords: [17.0, -88.0], radius: 10, risk: 5 }; // 10km radius
        pf.initializeGrid([riskZone]);

        // Point inside zone
        const insideCost = pf.getCost(17.0, -88.0);
        // Point far away
        const outsideCost = pf.getCost(18.0, -88.0);

        expect(insideCost).toBeGreaterThan(outsideCost);
        expect(insideCost).toBeGreaterThan(1.0);
        expect(outsideCost).toBe(1.0);
    });

    it('should find a path between two points', () => {
        const pf = new StrategicPathfinder(bounds, 0.1); // Low res for test speed
        const start = [17.0, -88.0];
        const end = [17.2, -88.2];

        const path = pf.findPath(start, end);

        expect(path).toBeTruthy();
        expect(path.length).toBeGreaterThan(1);

        // Check start and end approx
        const pStart = path[0];
        const pEnd = path[path.length - 1];

        expect(pf.getDist(pStart, start)).toBeLessThan(5);
        expect(pf.getDist(pEnd, end)).toBeLessThan(5);
    });

    it('should avoid high risk zones if possible', () => {
        // Setup: Start (0,0) -> End (0, 10). Risk Zone at (0, 5).
        // Scale coords to lat/lng for function to work
        const pf = new StrategicPathfinder(bounds, 0.1);

        const start = [17.0, -88.0];
        const end = [17.0, -87.6]; // ~40km East

        // Place a high risk zone in the middle
        const midPoint = [17.0, -87.8];
        const riskZone = { coords: midPoint, radius: 15, risk: 50 }; // High cost
        pf.initializeGrid([riskZone]);

        const path = pf.findPath(start, end);

        // Check if path deviates from the straight line latitude (17.0)
        let deviated = false;
        for (const p of path) {
            if (Math.abs(p[0] - 17.0) > 0.05) { // Deviated more than 0.05 deg (~5km)
                deviated = true;
                break;
            }
        }

        expect(deviated).toBeTruthy();
    });

});

const StrategicPathfinder = require('../../StrategicPathfinder');

describe('StrategicPathfinder [Unit]', () => {
    let pathfinder;
    const mockBounds = { north: 10, south: 0, east: 10, west: 0 };

    beforeEach(() => {
        pathfinder = new StrategicPathfinder(mockBounds, 1.0); // 1.0 resolution for easy math
    });

    test('should initialize with empty risk zones', () => {
        expect(pathfinder.riskZones).toEqual([]);
    });

    test('should calculate Haversine distance correctly', () => {
        // Known distance: (0,0) to (0,1) deg is approx 111km
        const dist = pathfinder.getDist([0,0], [0,1]);
        expect(dist).toBeCloseTo(111.19, 1);
    });

    test('should increase cost near risk zones', () => {
        // Add a risk zone at 5,5 with radius 100km and risk 10
        pathfinder.addRiskZone({ coords: [5, 5], radius: 100, risk: 10 });

        // Point right at center should have max added cost
        // Cost = Base(1.0) + Risk(10 * (1 - 0/100)) = 11.0
        const costCenter = pathfinder.getCost(5, 5);
        expect(costCenter).toBe(11.0);

        // Point at edge of radius should have near base cost
        // Distance approx 111km per degree.
        // 5.0, 5.0 -> 5.0, 6.0 is ~111km, so outside 100km radius.
        // Actually let's use a very close point inside.
        // 0.001 deg is ~111m.

        const costOutside = pathfinder.getCost(1, 1); // Far away
        expect(costOutside).toBe(1.0);
    });

    test('should find direct path when no obstacles', () => {
        // 0,0 to 0,3
        const start = [0, 0];
        const end = [0, 3];
        const path = pathfinder.findPath(start, end);

        expect(path.length).toBeGreaterThan(0);
        expect(path[0]).toEqual(start);
        // The algorithm returns closest node to end, might not be exact depending on resolution logic
        // But our heuristic should guide it there.
        // Since resolution is 1.0, steps are (0,0)->(0,1)->(0,2)->(0,3)
        const last = path[path.length-1];
        expect(pathfinder.getDist(last, end)).toBeLessThan(60); // Half resolution approx
    });
});

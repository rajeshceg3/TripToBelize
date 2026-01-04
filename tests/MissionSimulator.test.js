const MissionSimulator = require('../MissionSimulator');

// Mock dependencies
const mockLogistics = {
    calculateResourceDrain: () => ({ supplies: 1, fatigue: 1, integrity: 1 }),
    getDynamicRisk: () => 10,
    shouldTriggerEvent: () => false
};
const mockMap = {
    addLayer: jest.fn(),
    removeLayer: jest.fn()
};
const mockOverlay = {};

// Mock Leaflet Global
global.L = {
    divIcon: () => {},
    marker: () => ({ addTo: () => ({ setLatLng: () => {}, remove: () => {} }) }),
    circle: () => ({ addTo: () => ({ setLatLng: () => {}, remove: () => {} }) })
};

describe('MissionSimulator', () => {
    let sim;

    beforeEach(() => {
        sim = new MissionSimulator(mockMap, mockLogistics, mockOverlay, jest.fn(), jest.fn(), jest.fn());
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('initializes with correct state', () => {
        const locations = [
            { name: "Start", coords: [10, 10] },
            { name: "End", coords: [10, 11] }
        ];
        sim.start(locations);
        expect(sim.state.status).toBe('RUNNING');
        // Initial tick runs immediately, so supplies will be slightly less than 100
        expect(sim.state.supplies).toBeLessThanOrEqual(100);
        expect(sim.path.length).toBe(2);
    });

    test('completes mission successfully without crashing', () => {
        const locations = [
            { name: "Start", coords: [0, 0] },
            { name: "Mid", coords: [0, 1] },
            { name: "End", coords: [0, 2] }
        ];

        // Mock getDist to return reasonable distance (10km per step)
        // This ensures it takes a few ticks but not forever
        sim.getDist = (c1, c2) => 10;

        sim.start(locations);

        for (let i = 0; i < 50; i++) {
            jest.runOnlyPendingTimers();
            if (sim.state.status !== 'RUNNING') break;
        }

        expect(sim.state.status).toBe('COMPLETED');
        expect(sim.onComplete).toHaveBeenCalledWith(true);
    });

    test('updates route index correctly', () => {
        const locations = [
            { name: "A", coords: [0, 0] },
            { name: "B", coords: [0, 0.001] }, // 111m away approx
            { name: "C", coords: [0, 0.002] }
        ];

        // Path matches locations exactly for this test
        sim.path = [[0,0], [0,0.001], [0,0.002]];
        sim.route = locations;

        sim.state.status = 'RUNNING';
        sim.state.currentPathIndex = 0;
        sim.state.currentRouteIndex = 0;

        // Force distance calculation to return small value so it thinks we arrived
        // 0.05 km < 0.1 km threshold
        sim.getDist = () => 0.05;

        // Trigger move
        const moved = sim.moveUnit();

        expect(moved).toBe(true);
        expect(sim.state.currentPathIndex).toBe(1);
        expect(sim.state.currentRouteIndex).toBe(1);
    });
});

const MissionSimulator = require('../../MissionSimulator');
const LogisticsCore = require('../../LogisticsCore');

describe('MissionSimulator [Integration]', () => {
    let simulator;
    let logistics;

    beforeEach(() => {
        logistics = new LogisticsCore();
        // Mock Map and Overlay (Visuals are not needed for logic tests)
        const mockMap = {
            addLayer: jest.fn(),
            removeLayer: jest.fn()
        };

        // Leaflet mock global if needed, but we can just pass null for map if we mock createVisuals
        global.L = {
            divIcon: jest.fn(),
            marker: jest.fn().mockReturnValue({ addTo: jest.fn(), setLatLng: jest.fn(), remove: jest.fn() }),
            circle: jest.fn().mockReturnValue({ addTo: jest.fn(), setLatLng: jest.fn(), remove: jest.fn() })
        };

        simulator = new MissionSimulator(mockMap, logistics, null, jest.fn(), jest.fn(), jest.fn());
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should initialize with IDLE status', () => {
        expect(simulator.state.status).toBe('IDLE');
    });

    test('should start simulation and generate path', () => {
        const locations = [
            { coords: [0, 0], type_category: 'nature' },
            { coords: [0, 1], type_category: 'nature' }
        ];

        jest.useFakeTimers();

        simulator.start(locations);

        expect(simulator.state.status).toBe('RUNNING');
        expect(simulator.path.length).toBeGreaterThan(0);
        expect(simulator.onEvent).toHaveBeenCalledWith(expect.stringContaining('Initialized'), 'info');

        jest.runOnlyPendingTimers(); // Tick

        // It should have moved or updated logistics
        expect(simulator.onUpdate).toHaveBeenCalled();

        jest.useRealTimers();
    });

    test('should deplete resources over time', () => {
         const locations = [
            { coords: [0, 0], type_category: 'nature' },
            { coords: [0, 10], type_category: 'nature' } // Far away
        ];

        simulator.start(locations);
        const initialSupplies = simulator.state.supplies;

        // Force a logistics update
        simulator.updateLogistics();

        expect(simulator.state.supplies).toBeLessThan(initialSupplies);
    });

    test('should trigger completion when reaching end', () => {
        // Setup a very short path
        const locations = [
            { coords: [0, 0] },
            { coords: [0, 0.0001] } // Very close
        ];

        simulator.start(locations);

        // Run enough ticks
        for(let i=0; i<100; i++) {
             simulator.tick();
             if (simulator.state.status === 'COMPLETED') break;
        }

        expect(simulator.state.status).toBe('COMPLETED');
        expect(simulator.onComplete).toHaveBeenCalledWith(true);
    });
});

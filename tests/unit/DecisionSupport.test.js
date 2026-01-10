const DecisionSupport = require('../../DecisionSupport');

// MOCK ENVIRONMENT SETUP
// Bypass the need for jest-environment-jsdom by mocking the necessary browser APIs manually.
const localStorageMock = (function() {
    let store = {};
    return {
        getItem: jest.fn(key => store[key] || null),
        setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
        removeItem: jest.fn(key => { delete store[key]; }),
        clear: jest.fn(() => { store = {}; })
    };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('DecisionSupport [Unit]', () => {
    let ds;
    let mockLogistics;

    beforeEach(() => {
        // Mock LogisticsCore
        mockLogistics = {
            estimateMissionCost: jest.fn().mockReturnValue({ supplies: 10, fatigue: 10, integrity: 10 }),
            assessRisk: jest.fn().mockReturnValue({ score: 50, label: 'MED', color: 'yellow' }),
            calculateDurationHours: jest.fn().mockReturnValue(5)
        };

        ds = new DecisionSupport(mockLogistics);
        localStorage.clear();
        jest.spyOn(console, 'error').mockImplementation(() => {}); // Silence errors
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should save a valid scenario to localStorage', () => {
        const locations = [{ name: 'A' }, { name: 'B' }];
        const gear = ['rope'];
        const metrics = { totalDistance: 100 };

        const saved = ds.saveScenario('Test Op', locations, gear, metrics);

        expect(saved).toBeDefined();
        expect(saved.name).toBe('Test Op');
        expect(saved.id).toBeDefined();

        // Verify localStorage
        // Note: checking calls instead of direct store inspection is more robust with mocks
        expect(localStorage.setItem).toHaveBeenCalled();
    });

    test('should reject invalid scenario data', () => {
        const saved = ds.saveScenario(null, [], [], {});
        expect(saved).toBeNull();
    });

    test('should retrieve specific scenario by ID', () => {
        const locations = [{ name: 'A' }, { name: 'B' }];
        const s1 = ds.saveScenario('Op 1', locations, [], {});
        // Mock the getItem to return what we just "saved" (since our mock store logic is simple)
        // However, since we mock the implementation of setItem/getItem in the closure above, it should work "for real" within the memory of the mock.

        const retrieved = ds.getScenario(s1.id);
        expect(retrieved.name).toBe('Op 1');
    });

    test('should delete scenario by ID', () => {
        const locations = [{ name: 'A' }, { name: 'B' }];
        const s1 = ds.saveScenario('Op 1', locations, [], {});

        ds.deleteScenario(s1.id);
        const stored = ds.getScenarios();
        expect(stored).toHaveLength(0);
    });
});

/**
 * @jest-environment jsdom
 */
const DecisionSupport = require('../../DecisionSupport');
const LogisticsCore = require('../../LogisticsCore');

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
        const stored = JSON.parse(localStorage.getItem(ds.storageKey));
        expect(stored).toHaveLength(1);
        expect(stored[0].id).toBe(saved.id);
    });

    test('should reject invalid scenario data', () => {
        const saved = ds.saveScenario(null, [], [], {});
        expect(saved).toBeNull();
        expect(localStorage.getItem(ds.storageKey)).toBeNull();
    });

    test('should retrieve specific scenario by ID', () => {
        const locations = [{ name: 'A' }, { name: 'B' }];
        const s1 = ds.saveScenario('Op 1', locations, [], {});
        const s2 = ds.saveScenario('Op 2', locations, [], {});

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

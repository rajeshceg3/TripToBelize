const LogisticsCore = require('../LogisticsCore');

describe('LogisticsCore', () => {
    let core;

    beforeEach(() => {
        core = new LogisticsCore();
    });

    test('calculateResourceDrain returns correct structure', () => {
        const drain = core.calculateResourceDrain('nature', 1);
        expect(drain).toHaveProperty('supplies');
        expect(drain).toHaveProperty('fatigue');
        expect(drain).toHaveProperty('integrity');
        expect(drain.supplies).toBeGreaterThan(0);
    });

    test('assessRisk handles empty locations', () => {
        const risk = core.assessRisk([]);
        expect(risk.score).toBe(0);
        expect(risk.label).toBe("LOW");
    });

    test('assessRisk calculates critical risk correctly', () => {
        const locations = [
            { risk_level: 5 },
            { risk_level: 5 }
        ];
        // max(5)*1.5 + avg(5)*0.5 = 7.5 + 2.5 = 10 * 10 = 100
        const risk = core.assessRisk(locations);
        expect(risk.score).toBeGreaterThan(90); // Allow for weather mod
        expect(risk.label).toBe("CRITICAL");
    });

    test('validateLoadout detects missing gear', () => {
        const locations = [
            { required_gear: ['boots', 'water'] }
        ];
        const equipped = ['boots'];
        const result = core.validateLoadout(locations, equipped);

        expect(result.valid).toBe(false);
        expect(result.missing).toContain('water');
    });

    test('calculateETA handles valid routes', () => {
        const locations = [
            { type_category: 'other' },
            { type_category: 'other' }
        ];
        // 2 locs = 0 stops overhead.
        // Distance 100km. Speed 50km/h => 2h.
        const eta = core.calculateETA(locations, 100);
        expect(eta).toBe("2h 0m");
    });
});

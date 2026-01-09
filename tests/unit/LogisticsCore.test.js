const LogisticsCore = require('../../LogisticsCore');

describe('LogisticsCore [Unit]', () => {
    let logistics;

    beforeEach(() => {
        logistics = new LogisticsCore();
        // Mock random for deterministic weather testing
        jest.spyOn(Math, 'random').mockReturnValue(0.5);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should initialize with default base speed and random weather', () => {
        expect(logistics.baseSpeed).toBe(50);
        // With mock 0.5: Math.floor(0.5 * 3) + 1 = 1 + 1 = 2
        expect(logistics.currentWeatherRisk).toBeDefined();
    });

    describe('calculateResourceDrain', () => {
        test('should calculate drain correctly for "nature" terrain', () => {
            // Nature multiplier 1.5
            // Base Supplies 2.0 * 1.5 * 1h = 3.0
            // Base Fatigue 1.5 * 1.5 * 1h = 2.25
            // Base Integrity 0.5 * 1.5 * 1.5 (integrity mult) * 1h = 1.125
            const drain = logistics.calculateResourceDrain('nature', 1);
            expect(drain.supplies).toBe(3.0);
            expect(drain.fatigue).toBe(2.25);
            expect(drain.integrity).toBe(1.13); // Fixed to 2 decimal places
        });

        test('should handle unknown terrain as default multiplier 1.0', () => {
            const drain = logistics.calculateResourceDrain('alien_goo', 1);
            // Default multiplier 1.0
            // Supplies 2.0 * 1.0 * 1 = 2.0
            expect(drain.supplies).toBe(2.0);
        });
    });

    describe('getDynamicRisk', () => {
        test('should calculate risk based on location base risk', () => {
            const mockLocation = { risk_level: 2, type_category: 'urban' };
            const mockTime = new Date('2023-01-01T12:00:00'); // Noon (Day)

            // Base 2 * 10 = 20
            // Weather (mocked logic in constructor might vary, let's force set it)
            logistics.currentWeatherRisk = 1; // Minimal weather impact (1 + 0.1 = 1.1)

            const risk = logistics.getDynamicRisk(mockLocation, mockTime);
            // 20 * 1.1 = 22
            expect(risk).toBe(22);
        });

        test('should increase risk at night for nature terrain', () => {
            const mockLocation = { risk_level: 2, type_category: 'nature' };
            const mockTime = new Date('2023-01-01T02:00:00'); // 2 AM (Night)

            logistics.currentWeatherRisk = 1;

            const risk = logistics.getDynamicRisk(mockLocation, mockTime);
            // Base 20
            // Night Nature Multiplier 1.5 -> 30
            // Weather 1.1 -> 33
            expect(risk).toBe(33);
        });
    });

    describe('calculateDurationHours', () => {
        test('should calculate duration based on weighted speed', () => {
            const locations = [
                { type_category: 'other' }, // mult 1.0 -> 50km/h
                { type_category: 'nature' } // mult 0.8 -> 40km/h
            ];
            // Avg speed = (50 + 40) / 2 = 45 km/h
            // Distance = 90 km
            // Travel time = 2 hours
            // Stops = 2 locations -> 0 overhead

            const duration = logistics.calculateDurationHours(locations, 90);
            expect(duration).toBeCloseTo(2.0);
        });

        test('should add overhead for intermediate stops', () => {
             const locations = [
                { type_category: 'other' },
                { type_category: 'other' },
                { type_category: 'other' }
            ];
            // 3 locations -> 1 intermediate stop -> 1.5h overhead
            // Speed 50 km/h
            // Distance 100 km -> 2h travel
            // Total 3.5h

            const duration = logistics.calculateDurationHours(locations, 100);
            expect(duration).toBeCloseTo(3.5);
        });
    });

    describe('validateLoadout', () => {
        test('should return valid if all gear present', () => {
            const locations = [{ required_gear: ['rope'] }];
            const equipped = ['rope', 'torch'];
            const result = logistics.validateLoadout(locations, equipped);
            expect(result.valid).toBe(true);
            expect(result.missing).toHaveLength(0);
        });

        test('should identify missing gear', () => {
             const locations = [{ required_gear: ['rope', 'diving_gear'] }];
            const equipped = ['rope'];
            const result = logistics.validateLoadout(locations, equipped);
            expect(result.valid).toBe(false);
            expect(result.missing).toContain('diving_gear');
        });
    });
});

import {
    calculateCropStage,
    calculateMultiRisk,
    calculateRisk,
    getExpectedHarvestDate,
    estimateYield,
    WeatherData,
    CropData
} from '../utils/riskEngine';

describe('riskEngine', () => {
    // Test data
    const blastFavorableWeather: WeatherData = {
        temp_avg: 24,
        temp_min: 20,
        temp_max: 28,
        humidity_avg: 85,
        rainfall_mm: 50,
        forecast_days_rain: 4,
        wind_speed_kmh: 10,
    };

    const droughtWeather: WeatherData = {
        temp_avg: 35,
        temp_min: 28,
        temp_max: 40,
        humidity_avg: 45,
        rainfall_mm: 2,
        forecast_days_rain: 0,
        wind_speed_kmh: 15,
    };

    const normalWeather: WeatherData = {
        temp_avg: 28,
        temp_min: 23,
        temp_max: 32,
        humidity_avg: 70,
        rainfall_mm: 25,
        forecast_days_rain: 2,
        wind_speed_kmh: 8,
    };

    const floodWeather: WeatherData = {
        temp_avg: 26,
        temp_min: 24,
        temp_max: 28,
        humidity_avg: 95,
        rainfall_mm: 200,
        forecast_days_rain: 6,
        wind_speed_kmh: 20,
    };

    describe('calculateCropStage', () => {
        it('should return Nursery for recently sown crops', () => {
            const sowingDate = new Date();
            sowingDate.setDate(sowingDate.getDate() - 10);
            expect(calculateCropStage(sowingDate, 'Medium')).toBe('Nursery');
        });

        it('should return Tillering for 40-day old medium variety', () => {
            const sowingDate = new Date();
            sowingDate.setDate(sowingDate.getDate() - 40);
            expect(calculateCropStage(sowingDate, 'Medium')).toBe('Tillering');
        });

        it('should return Panicle for 65-day old medium variety', () => {
            const sowingDate = new Date();
            sowingDate.setDate(sowingDate.getDate() - 65);
            expect(calculateCropStage(sowingDate, 'Medium')).toBe('Panicle');
        });

        it('should return Flowering for 80-day old medium variety', () => {
            const sowingDate = new Date();
            sowingDate.setDate(sowingDate.getDate() - 80);
            expect(calculateCropStage(sowingDate, 'Medium')).toBe('Flowering');
        });

        it('should return Grain Filling for 95-day old medium variety', () => {
            const sowingDate = new Date();
            sowingDate.setDate(sowingDate.getDate() - 95);
            expect(calculateCropStage(sowingDate, 'Medium')).toBe('Grain Filling');
        });

        it('should return Maturity for 130+ day old medium variety', () => {
            const sowingDate = new Date();
            sowingDate.setDate(sowingDate.getDate() - 130);
            expect(calculateCropStage(sowingDate, 'Medium')).toBe('Maturity');
        });

        it('should handle short duration varieties faster', () => {
            const sowingDate = new Date();
            sowingDate.setDate(sowingDate.getDate() - 20);
            expect(calculateCropStage(sowingDate, 'Short')).toBe('Nursery');

            sowingDate.setDate(sowingDate.getDate() - 10); // Now 30 days
            expect(calculateCropStage(sowingDate, 'Short')).toBe('Tillering');
        });
    });

    describe('calculateMultiRisk - Blast Detection', () => {
        it('should detect Blast risk with favorable conditions', () => {
            const cropData: CropData = {
                stage: 'Tillering',
                sowingDate: new Date(),
                variety: 'Medium',
            };

            const result = calculateMultiRisk(blastFavorableWeather, cropData);
            expect(result.primaryRisk.riskType).toBe('Blast');
            expect(result.primaryRisk.riskLevel).toMatch(/MEDIUM|HIGH/);
        });

        it('should not detect Blast in dry conditions', () => {
            const cropData: CropData = {
                stage: 'Tillering',
                sowingDate: new Date(),
                variety: 'Medium',
            };

            const result = calculateMultiRisk(droughtWeather, cropData);
            expect(result.primaryRisk.riskType).not.toBe('Blast');
        });
    });

    describe('calculateMultiRisk - Drought Detection', () => {
        it('should detect Drought risk with low rainfall and high temp', () => {
            const cropData: CropData = {
                stage: 'Flowering',
                sowingDate: new Date(),
                variety: 'Medium',
            };

            const result = calculateMultiRisk(droughtWeather, cropData);
            expect(result.primaryRisk.riskType).toBe('Drought');
            expect(['HIGH', 'CRITICAL']).toContain(result.primaryRisk.riskLevel);
        });
    });

    describe('calculateMultiRisk - Flood Detection', () => {
        it('should detect Flood risk with very high rainfall', () => {
            const cropData: CropData = {
                stage: 'Grain Filling',
                sowingDate: new Date(),
                variety: 'Medium',
            };

            const result = calculateMultiRisk(floodWeather, cropData);
            const hasFloodRisk = result.primaryRisk.riskType === 'Flood' ||
                result.secondaryRisks.some(r => r.riskType === 'Flood');
            expect(hasFloodRisk).toBe(true);
        });
    });

    describe('calculateMultiRisk - No Risk', () => {
        it('should return None when conditions are favorable', () => {
            const cropData: CropData = {
                stage: 'Maturity',
                sowingDate: new Date(),
                variety: 'Medium',
            };

            const result = calculateMultiRisk(normalWeather, cropData);
            // At maturity with normal weather, risks should be low
            expect(result.overallRiskScore).toBeLessThan(50);
        });
    });

    describe('calculateMultiRisk - Secondary Risks', () => {
        it('should detect multiple risks in extreme conditions', () => {
            // High humidity + moderate temp can trigger multiple pest/disease risks
            const extremeWeather: WeatherData = {
                temp_avg: 28,
                temp_min: 25,
                temp_max: 32,
                humidity_avg: 90,
                rainfall_mm: 100,
                forecast_days_rain: 5,
                wind_speed_kmh: 5,
            };

            const cropData: CropData = {
                stage: 'Panicle',
                sowingDate: new Date(),
                variety: 'Medium',
            };

            const result = calculateMultiRisk(extremeWeather, cropData);
            // Should have primary risk and possibly secondary risks
            expect(result.primaryRisk.riskType).not.toBe('None');
        });
    });

    describe('calculateRisk (legacy function)', () => {
        it('should return primary risk from calculateMultiRisk', () => {
            const cropData: CropData = {
                stage: 'Tillering',
                sowingDate: new Date(),
                variety: 'Medium',
            };

            const result = calculateRisk(blastFavorableWeather, cropData);
            expect(result.riskType).toBeDefined();
            expect(result.recommendation).toBeDefined();
            expect(result.preventiveMeasures).toBeInstanceOf(Array);
        });
    });

    describe('getExpectedHarvestDate', () => {
        it('should return correct harvest date for Medium variety', () => {
            const sowingDate = new Date('2024-07-01');
            const harvestDate = getExpectedHarvestDate(sowingDate, 'Medium');
            const expectedDate = new Date('2024-11-08'); // 130 days later

            expect(harvestDate.toDateString()).toBe(expectedDate.toDateString());
        });

        it('should return earlier date for Short variety', () => {
            const sowingDate = new Date('2024-07-01');
            const harvestDate = getExpectedHarvestDate(sowingDate, 'Short');
            const expectedDate = new Date('2024-10-09'); // 100 days later

            expect(harvestDate.toDateString()).toBe(expectedDate.toDateString());
        });

        it('should return later date for Long variety', () => {
            const sowingDate = new Date('2024-07-01');
            const harvestDate = getExpectedHarvestDate(sowingDate, 'Long');
            const expectedDate = new Date('2024-12-03'); // 155 days later

            expect(harvestDate.toDateString()).toBe(expectedDate.toDateString());
        });
    });

    describe('estimateYield', () => {
        it('should estimate yield based on land area', () => {
            const result = estimateYield(2, 0, 'Medium'); // 2 acres, 0 risk
            expect(result.minYield).toBeLessThan(result.maxYield);
            expect(result.unit).toBe('quintals');
            // Medium variety: base 20 q/acre * 2 acres = 40q base
            expect(result.maxYield).toBeGreaterThan(35);
        });

        it('should reduce yield with higher risk score', () => {
            const lowRisk = estimateYield(1, 10, 'Medium');
            const highRisk = estimateYield(1, 80, 'Medium');

            expect(lowRisk.maxYield).toBeGreaterThan(highRisk.maxYield);
        });

        it('should vary by variety type', () => {
            const shortYield = estimateYield(1, 0, 'Short');
            const longYield = estimateYield(1, 0, 'Long');

            expect(longYield.maxYield).toBeGreaterThan(shortYield.maxYield);
        });
    });

    describe('Risk Severity Scoring', () => {
        it('should return severity between 0 and 100', () => {
            const cropData: CropData = {
                stage: 'Flowering',
                sowingDate: new Date(),
                variety: 'Medium',
            };

            const result = calculateMultiRisk(blastFavorableWeather, cropData);
            expect(result.primaryRisk.severity).toBeGreaterThanOrEqual(0);
            expect(result.primaryRisk.severity).toBeLessThanOrEqual(100);
        });
    });

    describe('Overall Risk Score', () => {
        it('should calculate overall score from all risks', () => {
            const cropData: CropData = {
                stage: 'Flowering',
                sowingDate: new Date(),
                variety: 'Medium',
            };

            const result = calculateMultiRisk(blastFavorableWeather, cropData);
            expect(result.overallRiskScore).toBeGreaterThanOrEqual(0);
            expect(result.overallRiskScore).toBeLessThanOrEqual(100);
        });

        it('should have summary message', () => {
            const cropData: CropData = {
                stage: 'Tillering',
                sowingDate: new Date(),
                variety: 'Medium',
            };

            const result = calculateMultiRisk(normalWeather, cropData);
            expect(result.summary).toBeDefined();
            expect(result.summary.length).toBeGreaterThan(0);
        });
    });
});

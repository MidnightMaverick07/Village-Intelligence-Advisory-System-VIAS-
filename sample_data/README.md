# 📊 Sample Data for VIAS Testing

This directory contains structured sample data files for testing and development of the **Village Intelligence & Advisory System (VIAS)**.

---

## 📁 Files Overview

| File | Purpose | Records |
|------|---------|---------|
| `weather_sample.json` | 7-day weather forecast for Bhatar | 7 days |
| `rice_prices_sample.json` | Mandi (market) prices for paddy | 7 days × 5 markets |
| `village_farmers.json` | Sample farmer database | 10 farmers |
| `pest_reports.json` | Pest/disease incident reports | 12 reports |
| `advisory_testcases.json` | Rule engine test cases | 10 test cases |

---

## 🧪 How to Use This Data

### 1. Weather Data Testing

**File:** `weather_sample.json`

Use this to test weather display components and risk calculations:

```typescript
import weatherData from '@/sample_data/weather_sample.json';

// Access current conditions
console.log(weatherData.current.temperature_2m); // 28.5

// Access 7-day forecast
weatherData.daily_forecast.forEach(day => {
  console.log(`${day.date}: ${day.temp_max}°C, Rain: ${day.rainfall_mm}mm`);
});
```

### 2. Mandi Price Testing

**File:** `rice_prices_sample.json`

Use for price display and trend analysis:

```typescript
import priceData from '@/sample_data/rice_prices_sample.json';

// Get today's best price
const todayPrices = priceData.daily_prices[6]; // Last entry (Dec 9)
console.log(priceData.price_trends.best_market_today); // "katwa"
console.log(priceData.price_trends.best_price_today);  // 2405
```

### 3. Farmer Database Testing

**File:** `village_farmers.json`

Use for dashboard statistics and farmer management:

```typescript
import farmerData from '@/sample_data/village_farmers.json';

// Get village statistics
console.log(farmerData.village_summary.total_irrigated_acres); // 9.9
console.log(farmerData.village_summary.pm_kisan_coverage_pct); // 90

// Iterate farmers
farmerData.farmers.forEach(farmer => {
  console.log(`${farmer.name}: ${farmer.land_area_acres} acres, ${farmer.variety_name}`);
});
```

### 4. Pest Report Testing

**File:** `pest_reports.json`

Use for alert generation and hotspot analysis:

```typescript
import pestData from '@/sample_data/pest_reports.json';

// Get high-severity reports
const criticalReports = pestData.reports.filter(r => r.severity === 'HIGH');
console.log(`Critical alerts: ${criticalReports.length}`);

// Get ward-wise hotspots
pestData.hotspot_wards.forEach(ward => {
  console.log(`Ward ${ward.ward}: ${ward.primary_pest} - ${ward.risk_level}`);
});
```

### 5. Rule Engine Testing

**File:** `advisory_testcases.json`

Use for automated testing of `utils/riskEngine.ts`:

```typescript
import testcases from '@/sample_data/advisory_testcases.json';
import { calculateMultiRisk } from '@/utils/riskEngine';

testcases.testcases.forEach(tc => {
  const result = calculateMultiRisk(tc.input.weather, tc.input.crop);
  
  // Validate primary risk type
  expect(result.primaryRisk.riskType).toBe(tc.expected_output.primary_risk_type);
  
  // Validate risk level
  expect(result.primaryRisk.riskLevel).toBe(tc.expected_output.risk_level);
  
  // Validate severity range
  expect(result.primaryRisk.severity).toBeGreaterThanOrEqual(tc.expected_output.severity_min);
  expect(result.primaryRisk.severity).toBeLessThanOrEqual(tc.expected_output.severity_max);
});
```

---

## 🧪 Running Jest Tests with Sample Data

### Option 1: Import in Test Files

```typescript
// __tests__/riskEngine.test.ts
import testcases from '../sample_data/advisory_testcases.json';

describe('Risk Engine Test Cases', () => {
  testcases.testcases.forEach(tc => {
    it(tc.name, () => {
      // Test implementation
    });
  });
});
```

### Option 2: Use as Fixtures

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- riskEngine.test.ts
```

---

## 📋 Data Schema Reference

### Weather Schema
```
{
  current: { temperature_2m, humidity, rain, wind_speed }
  daily_forecast: [{ date, temp_max, temp_min, rainfall_mm, ... }]
}
```

### Farmer Schema
```
{
  id, name, phone, ward, land_area_acres, land_type,
  sowing_date, variety_name, variety_duration,
  pm_kisan_registered, kcc_holder, pmfby_enrolled
}
```

### Pest Report Schema
```
{
  id, farmer_id, ward, pest_disease, severity (LOW|MEDIUM|HIGH),
  affected_area_pct, symptoms_observed, status
}
```

### Test Case Schema
```
{
  id, name, description,
  input: { weather: {...}, crop: {...} },
  expected_output: { risk_type, risk_level, severity_range, recommendations }
}
```

---

## 🔄 Updating Sample Data

When modifying sample data:

1. **Maintain consistency** — Farmer IDs should match across files
2. **Keep realistic values** — Use actual MSP rates, typical temperatures
3. **Document changes** — Update this README if schema changes
4. **Run tests** — Ensure changes don't break existing tests

---

## 📝 Notes

- All dates use ISO 8601 format (`YYYY-MM-DD`)
- Prices are in INR (Indian Rupees) per Quintal
- Coordinates are for West Bengal, India
- Bengali text (`_bn` fields) uses UTF-8 encoding

---

*Last updated: December 2025*

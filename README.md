<div align="center">

# 🌾 Village Intelligence & Advisory System (VIAS)

### *Empowering Smallholder Rice Farmers in West Bengal with Climate-Smart Agriculture*

[![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)

[Features](#-core-features) • [Tech Stack](#-technology-stack) • [Setup](#-setup-steps) • [API Docs](#-api-documentation) • [Contributing](#-contributing)

</div>

---

##  Table of Contents

- [Project Overview](#-project-overview)
- [Problem Statement](#-problem-statement)
- [Core Features](#-core-features)
- [Additional Features](#-additional-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Folder Structure](#-folder-structure)
- [Setup Steps](#-setup-steps)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Sample Data & Test Instructions](#-sample-data--test-instructions)
- [How to Run the Rule Engine](#-how-to-run-the-rule-engine)
- [Screenshots](#-screenshots)
- [Limitations](#-limitations)
- [Future Roadmap](#-future-roadmap)
- [License](#-license)
- [Contact / Author Info](#-contact--author-info)

---

##  Project Overview

**VIAS (Village Intelligence & Advisory System)** is a comprehensive Next.js-based agricultural advisory platform designed specifically for **smallholder paddy (rice) farmers** in **West Bengal, India**. The system provides real-time weather data, climate risk assessments, pest/disease alerts, and actionable advisories in both **English** and **Bengali (বাংলা)**.

The platform aggregates data from multiple sources including:

- **Open-Meteo API** for real-time weather forecasting
- **Rule-based Risk Engine** for disease/pest prediction
- **Local Mandi (Market) Rates** for price discovery
- **Government Schemes Database** for welfare access

---

##  Problem Statement

### Target Region: West Bengal, India

Small and marginal rice farmers in West Bengal face significant challenges:

| Challenge | Impact |
|-----------|--------|
| **Land Fragmentation** | 83% of farmers own < 2 acres of land |
| **Climate Vulnerability** | Monsoon variability, cyclones, and flooding |
| **Pest & Disease Pressure** | Blast, Brown Spot, BPH, Stem Borer infestations |
| **Information Asymmetry** | Limited access to timely advisories and market prices |
| **Low Digital Literacy** | Need for vernacular, voice-assisted interfaces |

### Key Problems Addressed

1. **Climate Risk** — Erratic monsoons, sudden temperature drops, and flooding during Kharif season
2. **Pest/Disease Outbreaks** — Delayed detection leads to 20-40% yield loss
3. **Market Access** — Farmers sell at farm-gate prices without mandi price visibility
4. **Scheme Awareness** — Low enrollment in PM-KISAN, PMFBY, and KCC despite eligibility

---

##  Core Features

###  Village Rice Dashboard

A comprehensive village-level overview providing:

- **Farmer Statistics** — Total registered farmers, acreage under cultivation
- **Live Weather Widget** — Current temperature, humidity, rainfall from Open-Meteo
- **7-Day Weather Forecast** — With rain probability and UV index
- **Mandi Price Ticker** — Real-time paddy rates from nearby markets
- **Pest Report Aggregation** — Ward-wise pest/disease heat map
- **Government Scheme Alerts** — Deadline reminders and eligibility checks
- **Crop Calendar Integration** — Current activities and upcoming tasks

###  Field-Level Climate Risk Advisory

Interactive advisory tool that calculates personalized risk based on:

- **Sowing Date** — Determines current crop stage (Seedling → Tillering → Flowering → Maturity)
- **Rice Variety** — Short (90d), Medium (120d), Long (150d) duration
- **Land Type** — Irrigated, Rainfed, or Partially Irrigated
- **Real-time Weather** — Temperature, humidity, rainfall, wind speed

#### Risk Types Evaluated:

| Risk Category | Trigger Conditions |
|---------------|-------------------|
| 🦠 **Blast Disease** | High humidity (>85%) + Temp 20-28°C + Rainfall |
| 🍂 **Brown Spot** | Water stress + humidity fluctuation |
| 🌿 **Sheath Blight** | Dense canopy + high humidity |
| 🐛 **BPH (Brown Planthopper)** | Warm nights + still air + excessive nitrogen |
| 🪲 **Stem Borer** | Hot dry spells during tillering |
| ☀️ **Drought Stress** | Low rainfall + high temperature |
| 🌊 **Flood Risk** | Heavy rainfall (>100mm) forecast |
| ❄️ **Cold Stress** | Night temp < 15°C during flowering |
| 🔥 **Heat Stress** | Day temp > 35°C during grain filling |

---

## 🔧 Additional Features

- **🌐 Bilingual Support** — Full English/Bengali (বাংলা) interface toggle
- **♿ Accessibility Panel** — Font size controls, high contrast mode, screen reader support
- **🌓 Dark/Light Theme** — System preference detection with manual toggle
- **📊 Interactive Charts** — Temperature and rainfall visualizations
- **📱 Responsive Design** — Mobile-first design for smartphone access
- **🔐 Authentication** — Farmer registration and login system
- **📄 PDF Advisory Export** — Download personalized advisories
- **🔍 Pest Scanner Placeholder** — UI for future image-based pest detection
- **📖 Knowledge Base** — Agricultural glossary and best practices
- **💰 Expense Tracker** — Farm input and output cost tracking

---

##  Technology Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14.1 (App Router) |
| **Language** | TypeScript 5.x |
| **Styling** | Tailwind CSS 3.3 |
| **Icons** | Lucide React |
| **Date Handling** | date-fns 3.x |
| **State Management** | React Context API |
| **API Client** | Native Fetch API |
| **Weather Data** | Open-Meteo API (Free, No API Key) |
| **Testing** | Jest + React Testing Library |
| **Linting** | ESLint (Next.js config) |

---

##  System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT BROWSER                                  │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                         NEXT.JS APP ROUTER                             │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │ │
│  │  │   Dashboard  │  │   Advisory   │  │   Schemes    │  │  Farmers   │ │ │
│  │  │    /dashboard│  │   /advisory  │  │   /schemes   │  │  /farmers  │ │ │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘ │ │
│  │         │                 │                 │                │        │ │
│  │  ┌──────┴─────────────────┴─────────────────┴────────────────┴──────┐ │ │
│  │  │                     SHARED COMPONENTS                            │ │ │
│  │  │  LanguageToggle │ ThemeToggle │ AccessibilityPanel │ Charts     │ │ │
│  │  └──────────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────┬─────────────────────────────────────┘
                                        │
                    ┌───────────────────┴───────────────────┐
                    │            NEXT.JS API ROUTES          │
                    │  ┌─────────────────────────────────┐  │
                    │  │ /api/weather   → Open-Meteo     │  │
                    │  │ /api/news      → RSS Feeds      │  │
                    │  │ /api/schemes   → Schemes Data   │  │
                    │  │ /api/farmers   → Farmer CRUD    │  │
                    │  └─────────────────────────────────┘  │
                    └───────────────────┬───────────────────┘
                                        │
        ┌───────────────────────────────┼───────────────────────────────┐
        │                               │                               │
┌───────┴───────┐              ┌────────┴────────┐              ┌───────┴───────┐
│  RISK ENGINE  │              │   DATA LAYER    │              │ EXTERNAL APIs │
│ ┌───────────┐ │              │ ┌─────────────┐ │              │ ┌───────────┐ │
│ │ calculateR│ │              │ │mockVillage  │ │              │ │Open-Meteo │ │
│ │ isk()     │ │              │ │.ts          │ │              │ │(Weather)  │ │
│ ├───────────┤ │              │ ├─────────────┤ │              │ └───────────┘ │
│ │ checkBlast│ │              │ │translations │ │              │               │
│ │ Risk()    │ │              │ │.ts          │ │              │               │
│ ├───────────┤ │              │ ├─────────────┤ │              │               │
│ │ checkDrou │ │              │ │mandiRates   │ │              │               │
│ │ ghtRisk() │ │              │ │.ts          │ │              │               │
│ └───────────┘ │              │ └─────────────┘ │              │               │
└───────────────┘              └─────────────────┘              └───────────────┘
```

---

##  Folder Structure

```
MyBharat/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── weather/route.ts      # Weather data from Open-Meteo
│   │   ├── news/route.ts         # Agricultural news aggregation
│   │   ├── schemes/route.ts      # Government schemes API
│   │   └── farmers/route.ts      # Farmer management API
│   ├── dashboard/                # Village Dashboard
│   │   ├── page.tsx              # Main dashboard page
│   │   └── village-selector.tsx  # Village dropdown component
│   ├── advisory/                 # Field-level Advisory
│   │   └── page.tsx              # Risk calculator form
│   ├── schemes/                  # Government Schemes
│   │   └── page.tsx              # Scheme listing and details
│   ├── farmers/                  # Farmer Management
│   │   └── page.tsx              # Farmer directory
│   ├── knowledge/                # Knowledge Base
│   │   └── page.tsx              # Glossary and guides
│   ├── login/                    # Authentication
│   │   └── page.tsx              # Login page
│   ├── register/                 # Registration
│   │   └── page.tsx              # Farmer registration
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
│
├── components/                   # Shared React Components
│   ├── AccessibilityPanel.tsx    # A11y controls overlay
│   ├── Charts.tsx                # Temperature/rainfall charts
│   ├── FontSizeControls.tsx      # Font size adjustment
│   ├── LanguageToggle.tsx        # EN/BN language switch
│   ├── ThemeToggle.tsx           # Dark/light mode toggle
│   ├── MarqueeTicker.tsx         # Scrolling news ticker
│   ├── NavAuth.tsx               # Auth-aware navigation
│   ├── NavLinks.tsx              # Navigation links
│   ├── ProtectedRoute.tsx        # Route protection HOC
│   ├── Tooltip.tsx               # Accessible tooltips
│   └── skeletons.tsx             # Loading skeletons
│
├── context/                      # React Context Providers
│   ├── AccessibilityContext.tsx  # Font size, contrast settings
│   ├── AuthContext.tsx           # Authentication state
│   ├── LanguageContext.tsx       # i18n language state
│   └── ThemeContext.tsx          # Theme preferences
│
├── data/                         # Static Data & Mock Data
│   ├── mockVillage.ts            # Sample farmer database
│   ├── villages.ts               # Village coordinates
│   ├── translations.ts           # EN/BN string mappings
│   ├── mandiRates.ts             # Market price simulation
│   ├── governmentSchemes.ts      # Scheme details + MSP rates
│   ├── cropCalendar.ts           # Kharif activity calendar
│   ├── intercrops.ts             # Intercropping suggestions
│   ├── pestDetection.ts          # Pest identification data
│   └── glossary.ts               # Agricultural terminology
│
├── utils/                        # Utility Functions
│   ├── riskEngine.ts             # Core risk calculation logic
│   └── pdfGenerator.ts           # Advisory PDF generation
│
├── __tests__/                    # Test Suites
│   └── riskEngine.test.ts        # Risk engine unit tests
│
├── coverage/                     # Jest coverage reports
├── public/                       # Static assets
├── package.json                  # Dependencies
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript config
├── jest.config.ts                # Jest configuration
└── README.md                     # This file
```

---

##  Setup Steps

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher (or yarn/pnpm)
- Git

### Frontend Setup

```bash
# 1. Clone the repository
git clone https://github.com/MidnightMaverick07/MyBharat.git
cd MyBharat

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Open in browser
# Navigate to http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

---

##  Environment Variables

This project currently uses **no API keys** for core functionality. The Open-Meteo weather API is free and keyless.

For future extensions, create a `.env.local` file:

### `.env.example`

```env
# ===========================================
# VIAS - Environment Variables
# ===========================================

# Base URL (for production deployment)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Weather API (Open-Meteo is free, no key needed)
# WEATHER_API_KEY=your_api_key_here

# Database (for future backend integration)
# DATABASE_URL=postgresql://user:password@localhost:5432/vias_db

# Authentication (for future auth provider)
# NEXTAUTH_SECRET=your_nextauth_secret
# NEXTAUTH_URL=http://localhost:3000

# SMS Gateway (for future OTP/alerts)
# SMS_API_KEY=your_sms_api_key
# SMS_SENDER_ID=VIAS

# Analytics (optional)
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

##  API Documentation

### 1. Weather API

**Endpoint:** `GET /api/weather`

Fetches real-time weather data from Open-Meteo.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `lat` | string | `23.42` | Latitude of location |
| `long` | string | `87.91` | Longitude of location |
| `village` | string | `Bhatar` | Village name for display |

**Response:**

```json
{
  "current": {
    "temperature": 28.5,
    "humidity": 75,
    "rain": 0,
    "windSpeed": 12.3
  },
  "daily": {
    "time": ["2024-07-15", "2024-07-16"],
    "tempMax": [32, 31],
    "tempMin": [24, 25],
    "rainSum": [0, 15],
    "uvIndex": [8, 7]
  },
  "location": {
    "lat": 23.42,
    "long": 87.91,
    "name": "Bhatar"
  }
}
```

### 2. Schemes API

**Endpoint:** `GET /api/schemes`

Returns all government agricultural schemes.

### 3. Farmers API

**Endpoint:** `GET /api/farmers`

Manages farmer registration data (CRUD operations).

### 4. News API

**Endpoint:** `GET /api/news`

Aggregates agricultural news from RSS feeds.

---

##  Sample Data & Test Instructions

### Pre-loaded Test Villages

| Village | District | Farmers | Lat/Long |
|---------|----------|---------|----------|
| Bhatar | Purba Bardhaman | 10 | 23.42, 87.91 |
| Memari | Purba Bardhaman | 5 | 23.19, 88.11 |
| Galsi | Purba Bardhaman | 5 | 23.33, 87.69 |
| Garbeta | Paschim Medinipur | — | 22.86, 87.36 |
| Sainthia | Birbhum | — | 23.94, 87.68 |

### Test Scenarios

#### Scenario 1: High Blast Risk

```
Sowing Date: 45 days ago
Weather: Temp 25°C, Humidity 90%, Rain 20mm
Expected: CRITICAL Blast Risk Alert
```

#### Scenario 2: Drought Stress

```
Sowing Date: 70 days ago
Weather: Temp 38°C, Humidity 40%, Rain 0mm (10 days)
Expected: HIGH Drought Risk Alert
```

#### Scenario 3: Normal Conditions

```
Sowing Date: 30 days ago
Weather: Temp 30°C, Humidity 70%, Rain 5mm
Expected: LOW Risk (Green Status)
```

---

##  How to Run the Rule Engine

The risk engine is located at `utils/riskEngine.ts` and can be used programmatically:

### Basic Usage

```typescript
import { calculateMultiRisk, calculateCropStage } from '@/utils/riskEngine';

// Define weather conditions
const weather = {
  temp_avg: 26,
  temp_min: 22,
  temp_max: 30,
  humidity_avg: 88,
  rainfall_mm: 15,
  forecast_days_rain: 3,
  wind_speed_kmh: 8
};

// Define crop data
const crop = {
  stage: calculateCropStage(new Date('2024-06-01')),
  sowingDate: new Date('2024-06-01'),
  variety: 'Medium' as const,
  soilType: 'Clay' as const
};

// Calculate risk
const result = calculateMultiRisk(weather, crop);

console.log(result.primaryRisk);      // Main risk identified
console.log(result.secondaryRisks);   // Other potential risks
console.log(result.overallRiskScore); // 0-100 score
console.log(result.summary);          // Human-readable summary
```

### Running Unit Tests

```bash
# Run risk engine tests
npm test -- riskEngine.test.ts

# View test coverage
npm run test:coverage
```

---

##  Screenshots



### Landing Page

![Landing Page]([./screenshots/landing.png](https://github.com/user-attachments/assets/b6dab7de-beed-44fe-a7c6-32d1aed6373))

### Village Dashboard

![Dashboard]([./screenshots/dashboard.png](https://github.com/user-attachments/assets/932940cf-cf92-4c40-a83a-48f159d2a23f))

### Field Advisory

![Advisory]([./screenshots/advisory.png](https://github.com/user-attachments/assets/5a15c80a-eb16-4dd1-81c0-ff6cb38ae226))

### Risk Alert

![Risk Alert](./screenshots/risk-alert.png)

### Advisory

![Advisory]([./screenshots/risk-alert.png](https://github.com/user-attachments/assets/d17a6774-d609-4fe4-8a85-ba0687ed0f76))

### Government Schemes

![Govt Schemes](./screenshots/risk-alert.png)

### Mobile View

![Mobile](./screenshots/mobile.png)

---

##  Limitations

| Limitation | Description |
|------------|-------------|
| **Mock Data** | Farmer database uses static mock data, not a real database |
| **No Backend** | No persistent storage; data resets on refresh |
| **Weather Accuracy** | Relies on Open-Meteo; hyperlocal forecasting not available |
| **No Image Recognition** | Pest scanner UI exists but ML model not integrated |
| **SMS/Voice Not Implemented** | No OTP verification or voice-based advisory |
| **Single State Focus** | Data and schemes specific to West Bengal only |
| **No Offline Mode** | Requires internet connectivity |
| **Limited Testing** | E2E tests not yet implemented |

---

##  Future Roadmap

### Phase 1: Backend Integration (Q1 2025)

- [ ] PostgreSQL/MongoDB database for farmer persistence
- [ ] Aadhaar-based farmer authentication
- [ ] REST API with Express.js or tRPC

### Phase 2: AI/ML Features (Q2 2025)

- [ ] Image-based pest/disease detection using TensorFlow.js
- [ ] Yield prediction model based on historical data
- [ ] Satellite imagery integration (NDVI analysis)

### Phase 3: Communication (Q3 2025)

- [ ] SMS alerts via Twilio/MSG91
- [ ] WhatsApp Business API integration
- [ ] Voice advisory in Bengali using Bhashini API

### Phase 4: Scale & Localization (Q4 2025)

- [ ] Expand to Odisha, Bihar, Jharkhand
- [ ] PWA with offline support
- [ ] Multi-crop support (wheat, jute, vegetables)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Subhojeet Ghosh

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 📬 Contact / Author Info

<div align="center">

### 👨‍💻 Subhojeet Ghosh

[![GitHub](https://img.shields.io/badge/GitHub-MidnightMaverick07-181717?style=for-the-badge&logo=github)](https://github.com/MidnightMaverick07)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-subhojeetghosh100-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/subhojeetghosh100/)
[![Email](https://img.shields.io/badge/Email-subhojeetghosh100%40gmail.com-EA4335?style=for-the-badge&logo=gmail)](mailto:subhojeetghosh100@gmail.com)

---

** If you find this project helpful, please give it a star!**

*Made with ❤️ for the farmers of West Bengal*

</div>




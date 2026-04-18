# WaitWise

Predict the best time to visit a clinic. Skip the wait.

## The Problem

Non-emergency clinic visits waste hours of patient time. Posted wait estimates are unreliable, and patients have no way to know when a clinic is actually quiet. The result: packed waiting rooms at peak hours, empty ones in between, and frustrated patients who could have come 30 minutes later and walked straight in.

## The Solution

WaitWise predicts the best 15-minute window to visit a clinic using a combination of real wait-time data and historical patterns. Patients open the app, see clinics near them ranked by predicted wait, and pick a time that fits their day.

## Key Features

- **Live wait times** for nearby clinics, pulled from public data sources
- **Best time predictor** — recommends the optimal arrival window based on historical patterns
- **Map and list view** of clinics in your area
- **Mobile-first design** — works on any phone browser, no app install needed

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Python (data processing and prediction logic)
- **Data sources:** CVS MinuteClinic public wait times, Google popular_times, simulated demo data
- **Deployment:** Vercel

## Data Approach

We combine three data sources:

1. **Real wait times** scraped from CVS MinuteClinic public listings
2. **Historical popularity patterns** from Google popular_times for clinics in the Quad Cities area
3. **Simulated demo data** for clinics without public feeds, generated using realistic time-of-day wait curves

Simulated data is clearly labeled. In production, this would be replaced by direct clinic API integrations.

## Team

- **Huzefa** — Pitch lead, product, frontend support
- **Kevin** — Frontend lead (React)
- **Tepy** — Design and UI polish
- **Lin** — Backend and data (Python)

## Getting Started

Clone the repo:
```
git clone https://github.com/[lin-username]/waitwise.git
cd waitwise
```

Install frontend dependencies:
```
npm install
npm run dev
```

Install backend dependencies:
```
pip install -r requirements.txt
```

## Demo

Live demo: [Vercel URL will go here once deployed]

## Status

Built for [Hackathon Name], April 2026.

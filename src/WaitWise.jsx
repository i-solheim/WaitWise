// WaitWise.jsx
// Drop this into src/WaitWise.jsx in your Vite React project.
// Then in src/App.jsx: import WaitWise from './WaitWise'; return <WaitWise />;
//
// Requires Tailwind CSS to be set up (see Tailwind Vite guide).
// No other dependencies needed.
import NavBar from './components/NavBar';
import { useState } from 'react';
import ClinicCard from './components/ClinicCard';
import MapView from './components/MapView';
import DetailView from './components/DetailView';
import ConfirmView from './components/ConfirmView';

// ==================== DATA ====================
// Replace this with: import clinicsData from './data/clinics.json';
// once Lin ships the JSON file
const clinicsData = [
  { id: 1, name: "CVS MinuteClinic", sub: "18th Ave & 7th St", type: "Walk-in", distance: 0.8, currentWait: 7, bestTime: "2:40 PM", bestWait: 4, real: true, x: 22, y: 38, hours: "8 AM – 8 PM", phone: "(309) 788-0412", rating: 4.3, hourly: [18, 25, 32, 28, 22, 15, 7, 4, 6, 10, 16, 20] },
  { id: 2, name: "Augustana Health Services", sub: "On campus, Westerlin Hall", type: "Student", distance: 0.3, currentWait: 12, bestTime: "3:15 PM", bestWait: 5, real: true, x: 42, y: 28, hours: "8 AM – 5 PM", phone: "(309) 794-7357", rating: 4.6, hourly: [20, 30, 28, 22, 18, 14, 10, 5, 8, 0, 0, 0] },
  { id: 3, name: "Quad City Urgent Care", sub: "Moline, 41st St", type: "Urgent", distance: 1.2, currentWait: 22, bestTime: "7:30 PM", bestWait: 10, real: false, x: 64, y: 55, hours: "24 hours", phone: "(309) 736-9595", rating: 4.1, hourly: [22, 35, 40, 38, 32, 28, 24, 18, 14, 12, 10, 16] },
  { id: 4, name: "Genesis Family Medicine", sub: "Rock Island, 30th St", type: "Primary", distance: 2.1, currentWait: 35, bestTime: "Tomorrow 9 AM", bestWait: 8, real: false, x: 30, y: 70, hours: "7 AM – 6 PM", phone: "(309) 281-4000", rating: 4.4, hourly: [30, 42, 48, 45, 38, 35, 32, 28, 22, 0, 0, 0] },
  { id: 5, name: "Walgreens Healthcare", sub: "Moline, 23rd Ave", type: "Walk-in", distance: 1.8, currentWait: 18, bestTime: "5:45 PM", bestWait: 6, real: true, x: 75, y: 25, hours: "9 AM – 9 PM", phone: "(309) 762-8801", rating: 4.0, hourly: [15, 22, 28, 25, 20, 18, 14, 10, 8, 6, 12, 18] },
  { id: 6, name: "UnityPoint Express Care", sub: "Bettendorf, 53rd St", type: "Urgent", distance: 3.4, currentWait: 45, bestTime: "Tomorrow 11 AM", bestWait: 12, real: false, x: 55, y: 78, hours: "8 AM – 8 PM", phone: "(563) 332-2700", rating: 4.2, hourly: [38, 48, 55, 50, 45, 42, 38, 32, 25, 20, 18, 0] },
  { id: 7, name: "OSF PromptCare", sub: "Rock Island, 18th Ave", type: "Urgent", distance: 0.6, currentWait: 15, bestTime: "6:15 PM", bestWait: 8, real: true, x: 35, y: 50, hours: "8 AM – 8 PM", phone: "(309) 779-5555", rating: 4.3, hourly: [20, 28, 32, 28, 24, 20, 15, 12, 10, 8, 14, 0] }
];

const symptoms = [
  { id: 'cold', label: 'Cold / flu', care: 'pharmacy' },
  { id: 'throat', label: 'Sore throat', care: 'walkin' },
  { id: 'rash', label: 'Rash / skin', care: 'walkin' },
  { id: 'sprain', label: 'Sprain / injury', care: 'urgent' },
  { id: 'checkup', label: 'Checkup', care: 'primary' },
  { id: 'chest', label: 'Chest pain', care: 'er' },
];

const careRecs = {
  pharmacy: { label: 'Pharmacist', note: 'For over-the-counter options, a pharmacist can help in under 10 min. No appointment needed.' },
  walkin: { label: 'Walk-in clinic', note: 'A walk-in clinic is ideal. We found 4 near you with wait times under 20 min.' },
  urgent: { label: 'Urgent care', note: 'Urgent care can handle this same-day. 3 locations available within 5 miles.' },
  primary: { label: 'Primary care', note: 'A primary care visit is best. Book ahead — today\'s slots are limited.' },
  er: { label: 'Emergency room', note: 'Chest pain should be evaluated immediately. Call 911 or go to the nearest ER.' }
};

// ==================== HELPERS ====================
function severity(min) {
  if (min <= 10) return 'short';
  if (min <= 25) return 'medium';
  return 'long';
}

const severityColors = {
  short: { border: 'border-l-red-300', text: 'text-red-300', bg: 'bg-red-50', badgeText: 'text-red-800', badgeBorder: 'border-red-300', pin: 'bg-red-300', pinText: 'text-red-900' },
  medium: { border: 'border-l-red-600', text: 'text-red-600', bg: 'bg-red-100', badgeText: 'text-red-900', badgeBorder: 'border-red-600', pin: 'bg-red-600', pinText: 'text-white' },
  long: { border: 'border-l-red-900', text: 'text-red-900', bg: 'bg-red-300', badgeText: 'text-red-950', badgeBorder: 'border-red-900', pin: 'bg-red-900', pinText: 'text-white' }
};

// ==================== SUB-COMPONENTS ====================


function SymptomTriage({ selected, onSelect }) {
  return (
    <div className="bg-white border border-red-200 rounded-xl p-4 mb-4 shadow-sm">
      <div className="text-xs text-red-800 mb-2.5 font-medium flex items-center gap-1.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        What's going on?
      </div>
      <div className="flex gap-1.5 flex-wrap mb-2.5">
        {symptoms.map(s => (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            className={`px-3.5 py-1.5 text-xs rounded-full border transition-all ${
              selected?.id === s.id
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-red-900 border-red-200 hover:border-red-400'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      {selected && (
        <div className="p-2.5 bg-red-50 border-l-4 border-red-600 rounded text-xs text-red-900">
          <strong className="font-medium">Recommended: {careRecs[selected.care].label}.</strong>{' '}
          {careRecs[selected.care].note}
        </div>
      )}
    </div>
  );
}

function StatsRow() {
  return (
    <div className="grid grid-cols-3 gap-2.5 mb-5">
      <div className="bg-white border border-red-200 rounded-lg p-3">
        <div className="text-[10px] text-red-800 mb-1 font-medium uppercase tracking-wide">Nearby</div>
        <div className="text-xl font-medium text-red-900">14</div>
        <div className="text-[10px] text-red-800/70">clinics</div>
      </div>
      <div className="bg-red-600 rounded-lg p-3 text-white">
        <div className="text-[10px] text-red-200 mb-1 font-medium uppercase tracking-wide">Shortest</div>
        <div className="text-xl font-medium">4 min</div>
        <div className="text-[10px] text-red-200">right now</div>
      </div>
      <div className="bg-white border border-red-200 rounded-lg p-3">
        <div className="text-[10px] text-red-800 mb-1 font-medium uppercase tracking-wide">Avg today</div>
        <div className="text-xl font-medium text-red-900">23 min</div>
        <div className="text-[10px] text-red-800/70">wait time</div>
      </div>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function WaitWise() {
  const [view, setView] = useState('home'); // 'home' | 'detail' | 'confirm'
  const [selectedClinicId, setSelectedClinicId] = useState(null);
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [mapMode, setMapMode] = useState(false);
  const [sortBy, setSortBy] = useState('wait');
  const [typeFilter, setTypeFilter] = useState('all');

  const selectedClinic = clinicsData.find(c => c.id === selectedClinicId);

  let displayed = typeFilter === 'all' ? [...clinicsData] : clinicsData.filter(c => c.type === typeFilter);
  if (sortBy === 'wait') displayed.sort((a, b) => a.currentWait - b.currentWait);
  else if (sortBy === 'distance') displayed.sort((a, b) => a.distance - b.distance);
  else displayed.sort((a, b) => a.bestWait - b.bestWait);

  const handleClinicClick = (id) => {
    setSelectedClinicId(id);
    setView('detail');
  };

  return (
    <div className="min-h-screen bg-red-50 p-5">
      <div className="max-w-3xl mx-auto bg-red-50 rounded-xl shadow-lg overflow-hidden">
        <NavBar />

        {view === 'home' && (
          <div className="p-6">
            <div className="text-center py-2 pb-6">
              <h1 className="text-[22px] font-medium text-red-900 mb-1.5">Find a clinic. Skip the wait.</h1>
              <p className="text-sm text-red-800">Live wait times and smart predictions for clinics near you</p>
            </div>

            <SymptomTriage selected={selectedSymptom} onSelect={setSelectedSymptom} />
            <StatsRow />

            <div className="flex justify-between items-center mb-3">
              <div className="text-sm font-medium text-red-900">Clinics near you</div>
              <div className="flex gap-1 bg-white border border-red-200 rounded-lg p-0.5">
                <button
                  onClick={() => setMapMode(false)}
                  className={`px-3.5 py-1 text-xs rounded-md border-0 cursor-pointer ${
                    !mapMode ? 'bg-red-600 text-white font-medium' : 'bg-transparent text-red-900'
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setMapMode(true)}
                  className={`px-3.5 py-1 text-xs rounded-md border-0 cursor-pointer ${
                    mapMode ? 'bg-red-600 text-white font-medium' : 'bg-transparent text-red-900'
                  }`}
                >
                  Map
                </button>
              </div>
            </div>

            <div className="flex gap-1.5 mb-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-red-200 bg-white text-red-900 cursor-pointer"
              >
                <option value="wait">Shortest wait</option>
                <option value="distance">Closest</option>
                <option value="best">Best time today</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-red-200 bg-white text-red-900 cursor-pointer"
              >
                <option value="all">All types</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Urgent">Urgent care</option>
                <option value="Primary">Primary care</option>
                <option value="Student">Student clinic</option>
              </select>
            </div>

            {mapMode ? (
              <MapView clinics={displayed} onClickClinic={handleClinicClick} />
            ) : (
              <div>
                {displayed.map(c => (
                  <ClinicCard key={c.id} clinic={c} onClick={() => handleClinicClick(c.id)} />
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'detail' && selectedClinic && (
          <DetailView
            clinic={selectedClinic}
            onBack={() => setView('home')}
            onBook={() => setView('confirm')}
          />
        )}

        {view === 'confirm' && selectedClinic && (
          <ConfirmView
            clinic={selectedClinic}
            onDone={() => setView('home')}
          />
        )}
      </div>
    </div>
  );
}

// WaitWise.jsx
// Drop this into src/WaitWise.jsx in your Vite React project.
// Then in src/App.jsx: import WaitWise from './WaitWise'; return <WaitWise />;
//
// Requires Tailwind CSS to be set up (see Tailwind Vite guide).
// No other dependencies needed.
import NavBar from './components/NavBar';
import { useState } from 'react';
import StatsRow from './components/StatsRow';
import SymptomTriage from './components/SymptomTriage';
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






function ClinicCard({ clinic, onClick }) {
  const s = severity(clinic.currentWait);
  const c = severityColors[s];
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-red-200 border-l-4 ${c.border} rounded-xl p-4 mb-2.5 cursor-pointer transition-all hover:border-red-600 hover:-translate-y-0.5 hover:shadow-md`}
    >
      <div className="flex justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <span className="text-sm font-medium text-red-900">{clinic.name}</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium tracking-wider ${
              clinic.real ? 'bg-red-600 text-white' : 'bg-red-100 text-red-800'
            }`}>
              {clinic.real ? 'LIVE' : 'PREDICTED'}
            </span>
          </div>
          <div className="text-[11px] text-red-800">{clinic.sub} · {clinic.distance} mi · {clinic.type}</div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className={`text-[22px] font-medium leading-none ${c.text}`}>
            {clinic.currentWait}<span className="text-[11px] text-red-800 font-normal"> min</span>
          </div>
          <div className={`text-[10px] mt-1 px-2 py-0.5 rounded-full inline-block font-medium border ${c.bg} ${c.badgeText} ${c.badgeBorder}`}>
            {s === 'short' ? 'Short' : s === 'medium' ? 'Medium' : 'Long'}
          </div>
        </div>
      </div>
      <div className="mt-2.5 pt-2.5 border-t border-dashed border-red-200 flex justify-between items-center">
        <div className="text-[11px] text-red-800 flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>Best: <strong className="text-red-600 font-medium">{clinic.bestTime}</strong> · {clinic.bestWait} min</span>
        </div>
        <div className="text-[11px] text-red-600 font-medium">Details →</div>
      </div>
    </div>
  );
}

function MapView({ clinics, onClickClinic }) {
  return (
    <div className="bg-white border border-red-200 rounded-xl relative h-[440px] overflow-hidden">
      <div
        className="absolute inset-0 bg-red-50 opacity-50"
        style={{
          backgroundImage: 'linear-gradient(#FECACA 1px, transparent 1px), linear-gradient(90deg, #FECACA 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />
      <div className="absolute top-3 left-3 bg-white border border-red-200 rounded-lg px-2.5 py-1.5 text-[11px] text-red-900 font-medium">
        Quad Cities · {clinics.length} clinics
      </div>
      {clinics.map(c => {
        const s = severity(c.currentWait);
        const col = severityColors[s];
        return (
          <div
            key={c.id}
            onClick={() => onClickClinic(c.id)}
            className="absolute cursor-pointer transition-transform hover:scale-110"
            style={{ left: `${c.x}%`, top: `${c.y}%`, transform: 'translate(-50%, -100%)' }}
          >
            <div className={`${col.pin} ${col.pinText} px-2.5 py-1 rounded-full text-[11px] font-medium border-2 border-white whitespace-nowrap shadow-md`}>
              {c.currentWait}m
            </div>
            <div className={`w-3 h-3 ${col.pin} border-2 border-white rounded-full mx-auto mt-0.5 shadow`}></div>
          </div>
        );
      })}
    </div>
  );
}

function DetailView({ clinic, onBack, onBook }) {
  const s = severity(clinic.currentWait);
  const c = severityColors[s];
  const hourLabels = ['9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p'];
  const validHours = clinic.hourly.filter(v => v > 0);
  const maxWait = Math.max(...validHours);
  const minWait = Math.min(...validHours);
  const bestIdx = clinic.hourly.findIndex(v => v === minWait);

  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="px-3.5 py-1.5 text-xs border border-red-200 bg-white text-red-900 rounded-lg cursor-pointer mb-4 font-medium hover:border-red-600"
      >
        ← Back
      </button>

      <div className="bg-white border border-red-200 rounded-xl p-5 mb-4">
        <div className="flex justify-between items-start gap-3 mb-3.5">
          <div className="flex-1">
            <h2 className="text-lg font-medium text-red-900 mb-1">{clinic.name}</h2>
            <p className="text-xs text-red-800 mb-1.5">{clinic.sub}</p>
            <div className="flex gap-2.5 text-[11px] text-red-800 flex-wrap">
              <span>{clinic.distance} mi away</span>
              <span>·</span>
              <span>{clinic.hours}</span>
              <span>·</span>
              <span className="text-red-600">★</span>
              <span>{clinic.rating}</span>
            </div>
          </div>
          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium tracking-wider ${
            clinic.real ? 'bg-red-600 text-white' : 'bg-red-100 text-red-800'
          }`}>
            {clinic.real ? 'LIVE' : 'PREDICTED'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <div className={`rounded-lg p-3 border ${c.bg} ${c.badgeBorder}`}>
            <div className={`text-[10px] mb-1 font-medium ${c.badgeText}`}>RIGHT NOW</div>
            <div className={`text-[28px] font-medium leading-none ${c.text}`}>
              {clinic.currentWait} <span className={`text-sm font-normal ${c.badgeText}`}>min</span>
            </div>
            <div className={`text-[10px] mt-1.5 ${c.badgeText}`}>
              {s === 'short' ? 'Short' : s === 'medium' ? 'Medium' : 'Long'} wait
            </div>
          </div>
          <div className="bg-red-600 rounded-lg p-3 text-white">
            <div className="text-[10px] mb-1 font-medium text-red-200">BEST TIME TODAY</div>
            <div className="text-base font-medium leading-tight">{clinic.bestTime}</div>
            <div className="text-[10px] mt-1.5 text-red-200">Expected: {clinic.bestWait} min wait</div>
          </div>
        </div>

        <div className="border-t border-dashed border-red-200 pt-3.5">
          <div className="text-xs font-medium text-red-900 mb-2.5">Predicted wait by hour</div>
          <div className="flex items-end gap-1 h-28">
            {clinic.hourly.map((v, i) => {
              const isClosed = v === 0;
              const h = isClosed ? 0 : Math.round((v / maxWait) * 100);
              const isBest = i === bestIdx;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className={`text-[9px] h-3 ${isBest ? 'text-red-600 font-medium' : 'text-red-800'}`}>
                    {isClosed ? '—' : v}
                  </div>
                  <div className="w-full max-w-[22px] h-20 flex items-end">
                    <div
                      className={`w-full rounded-t ${
                        isClosed ? 'bg-red-200' : isBest ? 'bg-red-600' : 'bg-red-300'
                      }`}
                      style={{ height: `${h}%`, minHeight: isClosed ? '2px' : '4px' }}
                    />
                  </div>
                  <div className={`text-[9px] ${isBest ? 'text-red-600 font-medium' : 'text-red-800'}`}>
                    {hourLabels[i]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onBook}
          className="flex-[2] py-3 text-sm border-0 bg-red-600 text-white rounded-lg cursor-pointer font-medium shadow-md hover:bg-red-700"
        >
          Remind me at {clinic.bestTime}
        </button>
        <button className="flex-1 py-3 text-sm border border-red-600 bg-white text-red-600 rounded-lg cursor-pointer font-medium hover:bg-red-50">
          Directions
        </button>
      </div>
    </div>
  );
}

function ConfirmView({ clinic, onDone }) {
  return (
    <div className="p-8">
      <div className="text-center max-w-md mx-auto my-8">
        <div className="w-[72px] h-[72px] bg-red-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h2 className="text-[22px] font-medium text-red-900 mb-2">You're all set</h2>
        <p className="text-sm text-red-800 mb-6">We'll remind you 15 minutes before your best time.</p>

        <div className="bg-white border border-red-200 rounded-xl p-4 text-left mb-4 shadow-sm">
          <div className="text-[11px] text-red-800 mb-2.5 font-medium tracking-wider">REMINDER DETAILS</div>
          <div className="flex justify-between text-sm mb-2 pb-2 border-b border-dashed border-red-200">
            <span className="text-red-800">Clinic</span>
            <span className="font-medium text-red-900">{clinic.name}</span>
          </div>
          <div className="flex justify-between text-sm mb-2 pb-2 border-b border-dashed border-red-200">
            <span className="text-red-800">Best time</span>
            <span className="font-medium text-red-600">{clinic.bestTime}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-red-800">Expected wait</span>
            <span className="font-medium text-red-900">{clinic.bestWait} min</span>
          </div>
        </div>

        <button
          onClick={onDone}
          className="px-7 py-2.5 text-sm border border-red-600 bg-white text-red-600 rounded-lg cursor-pointer font-medium hover:bg-red-50"
        >
          Back to clinics
        </button>
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

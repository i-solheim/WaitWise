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

export default function SymptomTriage({ selected, onSelect }) {
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
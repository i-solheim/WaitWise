import { severity, severityColors } from '../data/constants';

export default function ClinicCard({ clinic, onClick }) {
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
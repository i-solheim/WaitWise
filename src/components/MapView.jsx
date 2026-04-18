import { severity, severityColors } from '../data/constants';

export default function MapView({ clinics, onClickClinic }) {
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
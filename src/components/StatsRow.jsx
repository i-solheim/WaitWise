export default function StatsRow({ clinics = [] }) {
  const active = clinics.filter(c => c.currentWait > 0);
  
  const count = clinics.length;
  const shortest = active.length > 0 ? Math.min(...active.map(c => c.currentWait)) : 0;
  const average = active.length > 0 
    ? Math.round(active.reduce((sum, c) => sum + c.currentWait, 0) / active.length)
    : 0;

  return (
    <div className="grid grid-cols-3 gap-2.5 mb-5">
      <div className="bg-white border border-red-200 rounded-lg p-3">
        <div className="text-[10px] text-red-800 mb-1 font-medium uppercase tracking-wide">Nearby</div>
        <div className="text-xl font-medium text-red-900">{count}</div>
        <div className="text-[10px] text-red-800/70">clinics</div>
      </div>
      <div className="bg-red-600 rounded-lg p-3 text-white">
        <div className="text-[10px] text-red-200 mb-1 font-medium uppercase tracking-wide">Shortest</div>
        <div className="text-xl font-medium">{shortest} min</div>
        <div className="text-[10px] text-red-200">right now</div>
      </div>
      <div className="bg-white border border-red-200 rounded-lg p-3">
        <div className="text-[10px] text-red-800 mb-1 font-medium uppercase tracking-wide">Avg today</div>
        <div className="text-xl font-medium text-red-900">{average} min</div>
        <div className="text-[10px] text-red-800/70">wait time</div>
      </div>
    </div>
  );
}
export default function StatsRow() {
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
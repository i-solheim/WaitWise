export default function ConfirmView({ clinic, onDone }) {
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
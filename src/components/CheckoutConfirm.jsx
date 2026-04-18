export default function CheckoutConfirm({ clinic, waitedMinutes, pointsEarned, totalPoints, onDone }) {
  // Cap progress bar at 100%
  const progressPercent = Math.min((totalPoints / 100) * 100, 100);
  const pointsLeft = 100 - totalPoints;

  return (
    <div className="p-6">
      <div className="max-w-sm mx-auto mt-4">

        {/* Green checkmark circle */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center shadow-md">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-[22px] font-medium text-red-900 text-center mb-1">
          Verified & counted
        </h2>
        <p className="text-sm text-red-800 text-center mb-5">
          Your wait helps other Augie students.
        </p>

        {/* Details card */}
        <div className="bg-white border border-red-200 rounded-xl p-4 mb-4">
          <div className="text-[11px] text-red-800 font-medium tracking-wider mb-3">
            VISIT SUMMARY
          </div>

          <div className="flex justify-between text-sm mb-2 pb-2 border-b border-dashed border-red-200">
            <span className="text-red-800">Clinic</span>
            <span className="font-medium text-red-900">{clinic.name}</span>
          </div>

          <div className="flex justify-between text-sm mb-2 pb-2 border-b border-dashed border-red-200">
            <span className="text-red-800">Waited</span>
            <span className="font-medium text-red-900">{waitedMinutes} min</span>
          </div>

          <div className="flex justify-between text-sm mb-2 pb-2 border-b border-dashed border-red-200">
            <span className="text-red-800">Location verified</span>
            <span className="font-medium text-green-700">✓ Confirmed</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-red-800">Points earned</span>
            <span className="font-medium text-green-700">+{pointsEarned} pts</span>
          </div>
        </div>

        {/* Bookstore progress bar */}
        <div className="bg-white border border-red-200 rounded-xl p-4 mb-5">
          <div className="flex justify-between text-[11px] text-red-800 font-medium mb-2">
            <span>Augustana Bookstore Credit</span>
            <span>{totalPoints} / 100 pts</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-red-100 rounded-full h-2 mb-2">
            <div
              className="bg-red-600 h-2 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="text-[11px] text-red-800 text-center">
            {totalPoints >= 100
              ? '🎉 Unlocked! $5 bookstore credit ready'
              : `${pointsLeft} more points for $5 bookstore credit`
            }
          </div>
        </div>

        {/* Back button */}
        <button
          onClick={onDone}
          className="w-full py-3 text-sm border border-red-600 bg-white text-red-600 rounded-lg cursor-pointer font-medium hover:bg-red-50"
        >
          Back to clinics
        </button>
      </div>
    </div>
  );
}
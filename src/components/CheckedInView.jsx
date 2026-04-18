import { useState, useEffect } from 'react';

export default function CheckedInView({ clinic, checkinStartTime, onCheckout, onCancel, onBack }) {
  // elapsed stores how many seconds have passed since check-in
  const [elapsed, setElapsed] = useState(0);

  // useEffect runs code when the component appears on screen
  // The setInterval inside updates the timer every 1 second
  // The CRITICAL part: we return a cleanup function that calls clearInterval
  // This stops the timer when the user leaves this screen — without it,
  // the timer keeps running in the background and causes bugs
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - checkinStartTime) / 1000));
    }, 1000);

    return () => clearInterval(interval); // cleanup when component unmounts
  }, [checkinStartTime]);

  // Format seconds into MM:SS display
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const seconds = String(elapsed % 60).padStart(2, '0');

  // Format the check-in start time as "2:40 PM"
  const checkinTime = new Date(checkinStartTime).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  const metMinimum = elapsed >= 180; // 3 minutes = 180 seconds

  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="px-3.5 py-1.5 text-xs border border-red-200 bg-white text-red-900 rounded-lg cursor-pointer mb-4 font-medium hover:border-red-600"
      >
        ← Back to list
      </button>

      <div className="bg-white border-2 border-green-600 rounded-xl p-5 mb-4">
        {/* Green checkmark circle at top */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-3 shadow-md">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div className="text-[10px] text-green-700 font-medium tracking-wider uppercase mb-1">
            Checked In
          </div>
          <h2 className="text-lg font-medium text-red-900 text-center">{clinic.name}</h2>
          <p className="text-xs text-red-800 mt-1">Waiting since {checkinTime}</p>
        </div>

        {/* Live timer box */}
        <div className="bg-red-50 rounded-lg p-4 text-center mb-4">
          <div className="text-[10px] text-red-800 font-medium uppercase tracking-wider mb-2">
            Time Waiting
          </div>
          <div className="text-4xl font-medium text-red-600">
            {minutes}:{seconds}
          </div>
          {/* Status text changes based on whether 3 min has passed */}
          {metMinimum ? (
            <div className="text-xs text-green-700 mt-2">
              ✓ Minimum wait met — check-out will count
            </div>
          ) : (
            <div className="text-xs text-red-700 mt-2">
              Minimum 3 min wait required for valid check-out
            </div>
          )}
        </div>

        {/* Check out button — green */}
        <button
          onClick={onCheckout}
          className="w-full py-3 text-sm bg-green-600 text-white rounded-lg cursor-pointer font-medium shadow-md hover:bg-green-700 mb-2"
        >
          I was seen — Check out
        </button>

        {/* Cancel button — outlined red */}
        <button
          onClick={onCancel}
          className="w-full py-3 text-sm border border-red-600 bg-white text-red-600 rounded-lg cursor-pointer font-medium hover:bg-red-50"
        >
          Cancel check-in
        </button>
      </div>
    </div>
  );
}
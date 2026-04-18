export default function CheckoutDenied({ reason, value, onBack }) {
  return (
    <div className="p-6">
      <div className="max-w-sm mx-auto mt-8">

        {/* Red circle with info icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-md">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-[22px] font-medium text-red-900 text-center mb-2">
          Check-out not counted
        </h2>

        {/* Explanation — changes based on reason */}
        <p className="text-sm text-red-800 text-center mb-4">
          {reason === 'location'
            ? `You're ${value}m from the clinic. You must be within 100m to check out.`
            : `You only waited ${value} seconds. Minimum 180 seconds required to prevent spam.`
          }
        </p>

        {/* Info box */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-xs text-red-800 text-center">
          Your data won't be added. No points earned. This keeps wait times accurate for everyone.
        </div>

        {/* Back button */}
        <button
          onClick={onBack}
          className="w-full py-3 text-sm border border-red-600 bg-white text-red-600 rounded-lg cursor-pointer font-medium hover:bg-red-50"
        >
          Back
        </button>
      </div>
    </div>
  );
}
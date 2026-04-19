import { useState } from 'react';

function RedeemPopup({ reward, onClose }) {
  // Generate a random 3 digit code
  const code = `AUG-${Math.floor(100 + Math.random() * 900)}`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
        <div className="text-center mb-4">
          <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-900 mb-1">Your reward is ready!</h3>
          <p className="text-xs text-red-800">{reward.name}</p>
        </div>

        {/* Code box */}
        <div className="bg-red-50 border-2 border-dashed border-red-300 rounded-xl p-4 text-center mb-4">
          <div className="text-[11px] text-red-800 font-medium tracking-wider mb-1">SHOW THIS CODE</div>
          <div className="text-3xl font-medium text-red-600 tracking-widest">{code}</div>
        </div>

        <div className="bg-white border border-red-200 rounded-lg p-3 mb-4 text-xs text-red-800 text-center">
          📍 {reward.location}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 text-sm bg-red-600 text-white rounded-lg cursor-pointer font-medium border-0"
        >
          Done
        </button>
      </div>
    </div>
  );
}

export default function RedeemRewards({ points = 125, onBack }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedReward, setSelectedReward] = useState(null);

  const rewards = [
    { name: "$5 Augie Bookstore Credit", pts: 100, location: "Brunner Center", category: "bookstore", status: "available" },
    { name: "Free drink at Brew by the Slough", pts: 100, location: "4th floor, Gerber Center", category: "food", status: "available" },
    { name: "$5 Viking Bucks", pts: 100, location: "Loaded to student ID", category: "viking", status: "available" },
    { name: "$5 Cool Beanz Coffee", pts: 150, location: "College Hilltop District · 2 blocks from campus", category: "food", status: "almost" },
    { name: "$10 Bookstore Credit", pts: 250, location: "Brunner Center", category: "bookstore", status: "almost" },
    { name: "$15 Viking Bucks", pts: 500, location: "Loaded to student ID", category: "viking", status: "locked" },
    { name: "Priority Badge", pts: 1000, location: "Displayed on your profile", category: "bookstore", status: "locked" },
  ];

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'bookstore', label: 'Bookstore' },
    { id: 'food', label: 'Food & Coffee' },
    { id: 'viking', label: 'Viking Bucks' },
  ];

  const filtered = activeFilter === 'all' ? rewards : rewards.filter(r => r.category === activeFilter);
  const available = filtered.filter(r => r.pts <= points);
  const almost = filtered.filter(r => r.pts > points && r.pts <= points + 150);
  const locked = filtered.filter(r => r.pts > points + 150);

  return (
    <div className="p-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="px-3.5 py-1.5 text-xs border border-red-200 bg-white text-red-900 rounded-lg cursor-pointer mb-4 font-medium hover:border-red-600"
      >
        ← Back
      </button>

      {/* Balance bar */}
      <div className="bg-red-600 rounded-xl p-4 mb-5 flex justify-between items-center">
        <div>
          <div className="text-[10px] text-red-200 font-medium tracking-wider mb-0.5">YOUR BALANCE</div>
          <div className="text-2xl font-medium text-white">{points} <span className="text-sm text-red-200 font-normal">pts</span></div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-red-200 mb-0.5">Available rewards</div>
          <div className="text-lg font-medium text-white">{available.length} ready</div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-3.5 py-1.5 text-xs rounded-full border whitespace-nowrap cursor-pointer transition-all ${
              activeFilter === f.id
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-red-900 border-red-200 hover:border-red-400'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Available now */}
      {available.length > 0 && (
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2.5">
            <h3 className="text-sm font-medium text-red-900">Available now</h3>
            <span className="text-[11px] text-green-700 font-medium">{available.length} rewards</span>
          </div>
          {available.map((r, i) => (
            <div key={i} className="bg-white border border-red-200 rounded-xl p-3.5 mb-2 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-red-900">{r.name}</span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full font-medium tracking-wider">READY</span>
                </div>
                <div className="text-[11px] text-red-800">{r.location}</div>
                <div className="text-[11px] text-red-600 font-medium mt-0.5">{r.pts} pts</div>
              </div>
              <button
                onClick={() => setSelectedReward(r)}
                className="ml-3 bg-red-600 text-white border-0 px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer flex-shrink-0 hover:bg-red-700"
              >
                Redeem
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Almost there */}
      {almost.length > 0 && (
        <div className="mb-5">
          <h3 className="text-sm font-medium text-red-900 mb-2.5">Almost there</h3>
          {almost.map((r, i) => (
            <div key={i} className="bg-white border border-red-200 rounded-xl p-3.5 mb-2">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-sm font-medium text-red-900 mb-1">{r.name}</div>
                  <div className="text-[11px] text-red-800">{r.location}</div>
                </div>
                <div className="text-sm font-medium text-red-800 flex-shrink-0 ml-3">{r.pts} pts</div>
              </div>
              <div className="w-full h-1.5 bg-red-100 rounded-full overflow-hidden mb-1">
                <div className="h-full bg-red-600 rounded-full" style={{ width: `${Math.round((points / r.pts) * 100)}%` }}></div>
              </div>
              <div className="text-[10px] text-red-800">{points} / {r.pts} pts · {r.pts - points} more to unlock</div>
            </div>
          ))}
        </div>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <div className="mb-5">
          <h3 className="text-sm font-medium text-red-900 mb-2.5">Locked</h3>
          {locked.map((r, i) => (
            <div key={i} className="bg-white border border-red-200 rounded-xl p-3.5 mb-2 opacity-50">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium text-red-900 mb-1">🔒 {r.name}</div>
                  <div className="text-[11px] text-red-800">{r.location}</div>
                </div>
                <div className="text-sm font-medium text-red-800 flex-shrink-0 ml-3">{r.pts} pts</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popup */}
      {selectedReward && (
        <RedeemPopup
          reward={selectedReward}
          onClose={() => setSelectedReward(null)}
        />
      )}
    </div>
  );
}
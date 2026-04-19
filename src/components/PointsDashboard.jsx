export default function PointsDashboard({ points = 125, onBack, onRedeem }) {
  const pendingItems = [
    { clinic: "CVS MinuteClinic", time: "Yesterday at 2:45 PM", waited: 18, pts: 25, reason: "Clinic verification within 24h" },
    { clinic: "Augustana Health Services", time: "Today at 10:22 AM", waited: 8, pts: 15, reason: "Corroborating with other check-ins" }
  ];

  const recentActivity = [
    { clinic: "OSF PromptCare", time: "2 days ago", pts: 30 },
    { clinic: "Walgreens Healthcare", time: "3 days ago", pts: 25 },
    { clinic: "Welcome bonus", time: "First check-in", pts: 50 },
    { clinic: "Augustana Health Services", time: "1 week ago", pts: 20 }
  ];

  const rewards = [
    { name: "$5 Augie Bookstore Credit", pts: 100, location: "Brunner Center" },
    { name: "Free drink at Brew by the Slough", pts: 100, location: "4th floor, Gerber Center" },
    { name: "$5 Viking Bucks", pts: 100, location: "Loaded to student ID" },
    { name: "$5 Cool Beanz Coffee", pts: 150, location: "College Hilltop District" },
    { name: "$10 Bookstore Credit", pts: 250, location: "Brunner Center" },
  ];

  const available = rewards.filter(r => r.pts <= points);
  const almostThere = rewards.filter(r => r.pts > points && r.pts <= points + 150);

  const nextReward = rewards.find(r => r.pts > points);
  const progressPct = nextReward ? Math.round((points / nextReward.pts) * 100) : 100;

  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="px-3.5 py-1.5 text-xs border border-red-200 bg-white text-red-900 rounded-lg cursor-pointer mb-4 font-medium hover:border-red-600"
      >
        ← Back
      </button>

      {/* Hero balance card */}
      <div className="rounded-xl p-5 mb-5 text-white" style={{ background: 'linear-gradient(135deg, #DC2626 0%, #7F1D1D 100%)' }}>
        <div className="text-[11px] text-red-200 font-medium tracking-wider mb-1">YOUR BALANCE</div>
        <div className="text-[44px] font-medium leading-none mb-3">{points} <span className="text-sm text-red-200 font-normal">pts</span></div>
        {nextReward && (
          <>
            <div className="flex justify-between text-[11px] text-red-200 mb-1.5">
              <span>Next: {nextReward.name}</span>
              <span>{points} / {nextReward.pts}</span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-white rounded-full" style={{ width: `${progressPct}%` }}></div>
            </div>
          </>
        )}
        <button
          onClick={onRedeem}
          className="w-full py-2.5 bg-white text-red-600 rounded-lg text-sm font-medium border-0 cursor-pointer"
        >
          Redeem available rewards →
        </button>
      </div>

      {/* Pending verification */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2.5">
          <h3 className="text-sm font-medium text-red-900 m-0">Pending verification</h3>
          <span className="text-[11px] text-red-800">+{pendingItems.reduce((a, b) => a + b.pts, 0)} pts</span>
        </div>
        {pendingItems.map((item, i) => (
          <div key={i} className="bg-white border border-red-200 rounded-xl p-3.5 mb-2" style={{ borderLeft: '4px solid #D97706' }}>
            <div className="flex justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-red-900">{item.clinic}</span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded-full font-medium tracking-wider">PENDING</span>
                </div>
                <div className="text-[11px] text-red-800">{item.time} · waited {item.waited} min</div>
                <div className="text-[11px] text-yellow-700 mt-1">⏳ {item.reason}</div>
              </div>
              <div className="text-sm font-medium text-yellow-600">+{item.pts} pts</div>
            </div>
          </div>
        ))}
      </div>

      {/* Available rewards */}
      {available.length > 0 && (
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2.5">
            <h3 className="text-sm font-medium text-red-900 m-0">Available now</h3>
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
              </div>
              <button
                onClick={onRedeem}
                className="ml-3 bg-red-600 text-white border-0 px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer flex-shrink-0"
              >
                Redeem
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Almost there */}
      {almostThere.length > 0 && (
        <div className="mb-5">
          <h3 className="text-sm font-medium text-red-900 mb-2.5">Almost there</h3>
          {almostThere.map((r, i) => (
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

      {/* How to earn */}
      <div className="mb-5">
        <h3 className="text-sm font-medium text-red-900 mb-2.5">How to earn points</h3>
        <div className="bg-white border border-red-200 rounded-xl p-4">
          {[
            { label: "✓ Verified check-in", sub: "GPS + 3 min minimum", pts: "+15" },
            { label: "⏱ Standard wait (5-20 min)", sub: "Bonus for completing a visit", pts: "+10" },
            { label: "⏱ Long wait (20-45 min)", sub: "More valuable data", pts: "+20" },
            { label: "✓ Accuracy bonus", sub: "Your report matches crowd average", pts: "+5" },
            { label: "🔥 Daily streak", sub: "Check in 2+ days in a row", pts: "+25" },
          ].map((item, i, arr) => (
            <div key={i} className={`flex justify-between items-start py-2.5 ${i < arr.length - 1 ? 'border-b border-dashed border-red-200' : ''}`}>
              <div>
                <div className="text-sm font-medium text-red-900">{item.label}</div>
                <div className="text-[11px] text-red-800 mt-0.5">{item.sub}</div>
              </div>
              <div className="text-sm font-medium text-red-600 flex-shrink-0 ml-3">{item.pts} pts</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <h3 className="text-sm font-medium text-red-900 mb-2.5">Recent activity</h3>
        <div className="bg-white border border-red-200 rounded-xl px-4 py-1">
          {recentActivity.map((item, i, arr) => (
            <div key={i} className={`flex justify-between items-center py-2.5 ${i < arr.length - 1 ? 'border-b border-dashed border-red-200' : ''}`}>
              <div>
                <div className="text-xs font-medium text-red-900">{item.clinic}</div>
                <div className="text-[10px] text-red-800">{item.time}</div>
              </div>
              <div className="text-sm font-medium text-green-700">+{item.pts} pts</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
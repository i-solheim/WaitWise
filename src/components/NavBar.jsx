export default function NavBar({ points = 0 }) {
  return (
    <div className="bg-red-600 px-5 py-3.5 flex justify-between items-center">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#DC2626">
            <path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z"/>
          </svg>
        </div>
        <div>
          <div className="text-base font-medium text-white leading-tight">WaitWise</div>
          <div className="text-xs text-red-200 leading-tight">Skip the wait</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-white bg-white/15 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
          <span>Rock Island, IL</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-white bg-white/20 px-2.5 py-1 rounded-full font-medium">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
            <polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8"/>
          </svg>
          <span>{points} pts</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-white text-red-600 flex items-center justify-center text-xs font-medium">HA</div>
      </div>
    </div>
  );
}
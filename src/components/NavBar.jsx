export default function NavBar({ points = 0 }) {
  return (
    <div className="bg-red-600 px-5 py-3.5 flex justify-between items-center">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Pin shape */}
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
              fill="#dc2626"
            />
            {/* Heart shape — bigger and clearer */}
            <path
              d="M12 13c-1.5-1.2-3-2.3-3-3.8 0-1.5 1.2-2.2 2.1-1.5.3.2.6.5.9.8.3-.3.6-.6.9-.8.9-.7 2.1 0 2.1 1.5 0 1.5-1.5 2.6-3 3.8z"
              fill="white"
            />
          </svg>
        </div>
        <div>
          <div className="text-base font-medium text-white leading-tight">
            WaitWise
          </div>
          <div className="text-xs text-red-200 leading-tight">
            Skip the wait
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-white bg-white/15 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
          <span>Rock Island, IL</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-white bg-white/20 px-2.5 py-1 rounded-full font-medium">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
            <polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8" />
          </svg>
          <span>{points} pts</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-white text-red-600 flex items-center justify-center text-xs font-medium">
          HA
        </div>
      </div>
    </div>
  );
}

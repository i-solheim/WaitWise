import { severity, severityColors } from "../data/constants";
import {
  getUserLocation,
  haversine,
  MAX_DISTANCE_METERS,
} from "../utils/distance";

export default function DetailView({
  clinic,
  onBack,
  onCheckin,
  activeCheckin,
  allClinics = [],
  userLocation,
}) {
  const s = severity(clinic.currentWait);
  const c = severityColors[s];
  const hourLabels = [
    "9a",
    "10a",
    "11a",
    "12p",
    "1p",
    "2p",
    "3p",
    "4p",
    "5p",
    "6p",
    "7p",
    "8p",
  ];
  const validHours = clinic.hourly.filter((v) => v > 0);
  const maxWait = Math.max(...validHours);
  const minWait = Math.min(...validHours);
  const bestIdx = clinic.hourly.findIndex((v) => v === minWait);

  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="px-3.5 py-1.5 text-xs border border-red-200 bg-white text-red-900 rounded-lg cursor-pointer mb-4 font-medium hover:border-red-600"
      >
        ← Back
      </button>

      <div className="bg-white border border-red-200 rounded-xl p-5 mb-4">
        <div className="flex justify-between items-start gap-3 mb-3.5">
          <div className="flex-1">
            <h2 className="text-lg font-medium text-red-900 mb-1">
              {clinic.name}
            </h2>
            <p className="text-xs text-red-800 mb-1.5">{clinic.sub}</p>
            <div className="flex gap-2.5 text-[11px] text-red-800 flex-wrap">
              <span>{clinic.distance} mi away</span>
              <span>·</span>
              <span>{clinic.hours}</span>
              <span>·</span>
              <span className="text-red-600">★</span>
              <span>{clinic.rating}</span>
            </div>
          </div>
          <span
            className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium tracking-wider ${
              clinic.real ? "bg-red-600 text-white" : "bg-red-100 text-red-800"
            }`}
          >
            {clinic.real ? "LIVE" : "PREDICTED"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <div className={`rounded-lg p-3 border ${c.bg} ${c.badgeBorder}`}>
            <div className={`text-[10px] mb-1 font-medium ${c.badgeText}`}>
              RIGHT NOW
            </div>
            <div className={`text-[28px] font-medium leading-none ${c.text}`}>
              {clinic.currentWait}{" "}
              <span className={`text-sm font-normal ${c.badgeText}`}>min</span>
            </div>
            <div className={`text-[10px] mt-1.5 ${c.badgeText}`}>
              {s === "short" ? "Short" : s === "medium" ? "Medium" : "Long"}{" "}
              wait
            </div>
          </div>
          <div className="bg-red-600 rounded-lg p-3 text-white">
            <div className="text-[10px] mb-1 font-medium text-red-200">
              BEST TIME TODAY
            </div>
            <div className="text-base font-medium leading-tight">
              {clinic.bestTime}
            </div>
            <div className="text-[10px] mt-1.5 text-red-200">
              Expected: {clinic.bestWait} min wait
            </div>
          </div>
        </div>

        <div className="border-t border-dashed border-red-200 pt-3.5">
          <div className="text-xs font-medium text-red-900 mb-2.5">
            Predicted wait by hour
          </div>
          <div className="flex items-end gap-1 h-28">
            {clinic.hourly.map((v, i) => {
              const isClosed = v === 0;
              const h = isClosed ? 0 : Math.round((v / maxWait) * 100);
              const isBest = i === bestIdx;
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className={`text-[9px] h-3 ${isBest ? "text-red-600 font-medium" : "text-red-800"}`}
                  >
                    {isClosed ? "—" : v}
                  </div>
                  <div className="w-full max-w-[22px] h-20 flex items-end">
                    <div
                      className={`w-full rounded-t ${
                        isClosed
                          ? "bg-red-200"
                          : isBest
                            ? "bg-red-600"
                            : "bg-red-300"
                      }`}
                      style={{
                        height: `${h}%`,
                        minHeight: isClosed ? "2px" : "4px",
                      }}
                    />
                  </div>
                  <div
                    className={`text-[9px] ${isBest ? "text-red-600 font-medium" : "text-red-800"}`}
                  >
                    {hourLabels[i]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {(() => {
        const isCheckedInHere = activeCheckin?.clinicId === clinic.id;
        const isCheckedInElsewhere =
          activeCheckin && activeCheckin.clinicId !== clinic.id;
        const otherClinic = isCheckedInElsewhere
          ? allClinics.find((c) => c.id === activeCheckin.clinicId)
          : null;

        if (isCheckedInHere) {
          return (
            <div className="p-3 bg-green-50 border-2 border-green-600 rounded-lg text-center">
              <div className="text-xs font-medium text-green-800 mb-1">
                ✓ YOU'RE CHECKED IN HERE
              </div>
              <div className="text-sm text-green-900">
                Go to your active check-in to check out when seen.
              </div>
            </div>
          );
        }

        if (isCheckedInElsewhere) {
          return (
            <div>
              <div className="p-3 bg-red-100 border border-red-600 rounded-lg text-center text-xs text-red-900 mb-3">
                You're already checked in at{" "}
                <strong>{otherClinic?.name || "another clinic"}</strong>. Check
                out first.
              </div>
              <button
                disabled
                className="w-full py-3 text-sm border-0 bg-red-300 text-white rounded-lg cursor-not-allowed font-medium"
              >
                Check in here
              </button>
            </div>
          );
        }

        return (
          <div className="flex gap-2">
            <button
              onClick={async () => {
                try {
                  const coords = await getUserLocation();
                  const dist = haversine(
                    coords.lat,
                    coords.lng,
                    clinic.lat || 41.5067,
                    clinic.lng || -90.5487,
                  );
                  if (dist > MAX_DISTANCE_METERS) {
                    alert(
                      `You're ${dist}m away — must be within 100m to check in.`,
                    );
                    return;
                  }
                  onCheckin(clinic.id, clinic.currentWait);
                } catch (err) {
                  alert(
                    "Could not get your location. Please allow location access.",
                  );
                }
              }}
              className="flex-[2] py-3 text-sm border-0 bg-red-600 text-white rounded-lg cursor-pointer font-medium shadow-md hover:bg-red-700 flex items-center justify-center gap-2"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              Check in here
            </button>
            <button
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${clinic.lat},${clinic.lng}`,
                  "_blank",
                )
              }
              className="flex-1 py-3 text-sm border border-red-600 bg-white text-red-600 rounded-lg cursor-pointer font-medium hover:bg-red-50"
            >
              Directions
            </button>
          </div>
        );
      })()}
    </div>
  );
}

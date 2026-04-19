import {
  getUserLocation,
  haversine,
  MAX_DISTANCE_METERS,
  MIN_WAIT_SECONDS,
} from "./utils/distance";
import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import StatsRow from "./components/StatsRow";
import SymptomTriage from "./components/SymptomTriage";
import ClinicCard from "./components/ClinicCard";
import MapView from "./components/MapView";
import DetailView from "./components/DetailView";
import ConfirmView from "./components/ConfirmView";
import CheckedInView from "./components/CheckedInView";
import CheckoutDenied from "./components/CheckoutDenied";
import CheckoutConfirm from "./components/CheckoutConfirm";
import { fetchClinics, submitCheckin, getUserId } from "./utils/api";

// ==================== POINT CALCULATION ====================
// Calculates points earned from a check-out
// Based on: base reward + wait-time bonus + accuracy bonus - repeat-visit decay
function calculatePoints(waitedMinutes, clinicAverageWait, isRepeatVisit) {
  const breakdown = [];
  let total = 0;

  // Base reward: verified check-in (GPS + 3 min minimum already passed)
  breakdown.push({ label: "Verified check-in", pts: 15 });
  total += 15;

  // Wait-time bonus (capped — can't farm by waiting forever)
  let waitBonus = 0;
  if (waitedMinutes >= 5 && waitedMinutes < 20) {
    waitBonus = 10;
    breakdown.push({ label: "Standard wait bonus", pts: 10 });
  } else if (waitedMinutes >= 20) {
    waitBonus = 20;
    breakdown.push({ label: "Long wait bonus (capped at 45 min)", pts: 20 });
  }
  total += waitBonus;

  // Accuracy bonus — matches the crowd within 15%
  if (waitedMinutes >= 5 && clinicAverageWait > 0) {
    const diff = Math.abs(waitedMinutes - clinicAverageWait);
    const percentDiff = (diff / clinicAverageWait) * 100;
    if (percentDiff <= 15) {
      breakdown.push({ label: "Accuracy bonus (matches crowd)", pts: 5 });
      total += 5;
    }
  }

  // Repeat-visit decay
  if (isRepeatVisit === "same-day") {
    breakdown.push({ label: "Same clinic today — no points", pts: -total });
    total = 0;
  } else if (isRepeatVisit === "within-48h") {
    const halfOff = Math.round(total * 0.5);
    breakdown.push({ label: "Within 48h — half points", pts: -halfOff });
    total = total - halfOff;
  }

  return { total, breakdown };
}

// ==================== DATA ====================
const clinicsData = [
  {
    id: 1,
    name: "CVS MinuteClinic",
    lat: 41.4939313,
    lng: -90.5627607,
    sub: "18th Ave & 7th St",
    type: "Walk-in",
    distance: 0.8,
    currentWait: 7,
    bestTime: "2:40 PM",
    bestWait: 4,
    real: true,
    x: 22,
    y: 38,
    hours: "8 AM – 8 PM",
    phone: "(309) 788-0412",
    rating: 4.3,
    hourly: [18, 25, 32, 28, 22, 15, 7, 4, 6, 10, 16, 20],
  },
  {
    id: 2,
    name: "Augustana Health Services",
    lat: 41.5018999,
    lng: -90.5520560,
    sub: "On campus, Westerlin Hall",
    type: "Student",
    distance: 0.3,
    currentWait: 12,
    bestTime: "3:15 PM",
    bestWait: 5,
    real: true,
    x: 42,
    y: 28,
    hours: "8 AM – 5 PM",
    phone: "(309) 794-7357",
    rating: 4.6,
    hourly: [20, 30, 28, 22, 18, 14, 10, 5, 8, 0, 0, 0],
  },
  {
    id: 3,
    name: "Quad City Urgent Care",
    lat: 41.5361297,
    lng: -90.5198025,
    sub: "Bettendorf",
    type: "Urgent",
    distance: 1.2,
    currentWait: 22,
    bestTime: "7:30 PM",
    bestWait: 10,
    real: false,
    x: 64,
    y: 55,
    hours: "24 hours",
    phone: "(309) 736-9595",
    rating: 4.1,
    hourly: [22, 35, 40, 38, 32, 28, 24, 18, 14, 12, 10, 16],
  },
  {
    id: 4,
    name: "Genesis Family Medicine",
    lat: 41.4847986,
    lng: -90.4818804,
    sub: "Rock Island, 30th St",
    type: "Primary",
    distance: 2.1,
    currentWait: 35,
    bestTime: "Tomorrow 9 AM",
    bestWait: 8,
    real: false,
    x: 30,
    y: 70,
    hours: "7 AM – 6 PM",
    phone: "(309) 281-4000",
    rating: 4.4,
    hourly: [30, 42, 48, 45, 38, 35, 32, 28, 22, 0, 0, 0],
  },
  {
    id: 5,
    name: "Walgreens Healthcare",
    lat: 41.4939807,
    lng: -90.5576596,
    sub: "Moline, 23rd Ave",
    type: "Walk-in",
    distance: 1.8,
    currentWait: 18,
    bestTime: "5:45 PM",
    bestWait: 6,
    real: true,
    x: 75,
    y: 25,
    hours: "9 AM – 9 PM",
    phone: "(309) 762-8801",
    rating: 4.0,
    hourly: [15, 22, 28, 25, 20, 18, 14, 10, 8, 6, 12, 18],
  },
  {
    id: 6,
    name: "UnityPoint Express Care",
    lat: 41.4925314,
    lng: -90.5370982,
    sub: "Bettendorf, 53rd St",
    type: "Urgent",
    distance: 3.4,
    currentWait: 45,
    bestTime: "Tomorrow 11 AM",
    bestWait: 12,
    real: false,
    x: 55,
    y: 78,
    hours: "8 AM – 8 PM",
    phone: "(563) 332-2700",
    rating: 4.2,
    hourly: [38, 48, 55, 50, 45, 42, 38, 32, 25, 20, 18, 0],
  },
  {
    id: 7,
    name: "OSF PromptCare",
    lat: 41.4831887,
    lng: -90.5705329,
    sub: "Rock Island, 18th Ave",
    type: "Urgent",
    distance: 0.6,
    currentWait: 15,
    bestTime: "6:15 PM",
    bestWait: 8,
    real: true,
    x: 35,
    y: 50,
    hours: "8 AM – 8 PM",
    phone: "(309) 779-5555",
    rating: 4.3,
    hourly: [20, 28, 32, 28, 24, 20, 15, 12, 10, 8, 14, 0],
  },
];

// ==================== MAIN COMPONENT ====================
export default function WaitWise() {
  // View navigation state
  const [view, setView] = useState("home");
  const [selectedClinicId, setSelectedClinicId] = useState(null);
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [mapMode, setMapMode] = useState(false);
  const [sortBy, setSortBy] = useState("wait");
  const [typeFilter, setTypeFilter] = useState("all");

  // NEW state for check-in + points + GPS
  const [activeCheckin, setActiveCheckin] = useState(null);
  const [points, setPoints] = useState(50);
  const [userLocation, setUserLocation] = useState(null);
  const [clinics, setClinics] = useState(clinicsData);
  const [isLoadingClinics, setIsLoadingClinics] = useState(true);
  const [apiError, setApiError] = useState(null);

  const selectedClinic = clinics.find(
    (c) => String(c.id) === String(selectedClinicId),
  );

  const [deniedReason, setDeniedReason] = useState(null);
  const [deniedValue, setDeniedValue] = useState(null);

  const [lastCheckout, setLastCheckout] = useState(null); // { waitedMinutes, pointsEarned }

  let displayed =
    typeFilter === "all"
      ? [...clinics]
      : clinics.filter((c) => c.type === typeFilter);
  if (sortBy === "wait")
    displayed.sort((a, b) => a.currentWait - b.currentWait);
  else if (sortBy === "distance")
    displayed.sort((a, b) => a.distance - b.distance);
  else displayed.sort((a, b) => a.bestWait - b.bestWait);

  useEffect(() => {
    (async () => {
      try {
        const backendClinics = await fetchClinics();
        setClinics(backendClinics);
      } catch (err) {
        console.warn("Failed to load clinics from backend:", err);
        setApiError("Unable to load live clinic data. Using local fallback data.");
      } finally {
        setIsLoadingClinics(false);
      }
    })();
  }, []);

  const handleClinicClick = (id) => {
    setSelectedClinicId(id);
    setView("detail");
  };

  return (
    <div className="min-h-screen bg-red-50 p-5">
      <div className="max-w-3xl mx-auto bg-red-50 rounded-xl shadow-lg overflow-hidden">
        <NavBar points={points} />

        {view === "home" && (
          <div className="p-6">
            <div className="text-center py-2 pb-6">
              <h1 className="text-[22px] font-medium text-red-900 mb-1.5">
                Find a clinic. Skip the wait.
              </h1>
              <p className="text-sm text-red-800">
                Live wait times and smart predictions for clinics near you
              </p>
            </div>

            <SymptomTriage
              selected={selectedSymptom}
              onSelect={setSelectedSymptom}
            />
            <StatsRow />

            <div className="flex justify-between items-center mb-3">
              <div className="text-sm font-medium text-red-900">
                Clinics near you
              </div>
              <div className="flex gap-1 bg-white border border-red-200 rounded-lg p-0.5">
                <button
                  onClick={() => setMapMode(false)}
                  className={`px-3.5 py-1 text-xs rounded-md border-0 cursor-pointer ${
                    !mapMode
                      ? "bg-red-600 text-white font-medium"
                      : "bg-transparent text-red-900"
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setMapMode(true)}
                  className={`px-3.5 py-1 text-xs rounded-md border-0 cursor-pointer ${
                    mapMode
                      ? "bg-red-600 text-white font-medium"
                      : "bg-transparent text-red-900"
                  }`}
                >
                  Map
                </button>
              </div>
            </div>

            <div className="flex gap-1.5 mb-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-red-200 bg-white text-red-900 cursor-pointer"
              >
                <option value="wait">Shortest wait</option>
                <option value="distance">Closest</option>
                <option value="best">Best time today</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-red-200 bg-white text-red-900 cursor-pointer"
              >
                <option value="all">All types</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Urgent">Urgent care</option>
                <option value="Primary">Primary care</option>
                <option value="Student">Student clinic</option>
              </select>
            </div>

            {mapMode ? (
              <MapView clinics={displayed} onClickClinic={handleClinicClick} />
            ) : (
              <div>
                {displayed.map((c) => (
                  <ClinicCard
                    key={c.id}
                    clinic={c}
                    onClick={() => handleClinicClick(c.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {view === "detail" && selectedClinic && (
          <DetailView
            clinic={selectedClinic}
            activeCheckin={activeCheckin}
            allClinics={clinics}
            userLocation={userLocation}
            onBack={() => setView("home")}
            onCheckin={async (clinicId, reportedWait) => {
              if (activeCheckin && activeCheckin.clinicId !== clinicId) {
                alert("You're already checked in elsewhere. Check out first.");
                return;
              }

              try {
                const result = await submitCheckin(
                  clinicId,
                  reportedWait,
                  getUserId(),
                );
                setPoints(result.total_points);
                setActiveCheckin({ clinicId, startTime: Date.now() });
                setView("checkedin");
                fetchClinics()
                  .then(setClinics)
                  .catch((err) =>
                    console.warn("Could not refresh clinics after check-in:", err),
                  );
              } catch (err) {
                alert(`Check-in failed: ${err.message}`);
              }
            }}
          />
        )}

        {view === "checkedin" && (
          selectedClinic ? (
            <CheckedInView
              clinic={selectedClinic}
              checkinStartTime={activeCheckin?.startTime}
              onBack={() => setView("home")}
              onCancel={() => {
                setActiveCheckin(null);
                setView("home");
              }}
              onCheckout={async () => {
              const elapsed = Math.floor(
                (Date.now() - activeCheckin.startTime) / 1000,
              );
              if (elapsed < MIN_WAIT_SECONDS) {
                setDeniedReason("time");
                setDeniedValue(elapsed);
                setView("denied");
                return;
              }
              try {
                const coords = await getUserLocation();
                const dist = haversine(
                  coords.lat,
                  coords.lng,
                  selectedClinic.lat || 41.5067,
                  selectedClinic.lng || -90.5487,
                );
                if (dist > MAX_DISTANCE_METERS) {
                  setDeniedReason("location");
                  setDeniedValue(dist);
                  setView("denied");
                  return;
                }
                const waitedMinutes = Math.floor(elapsed / 60);
                const { total: pointsEarned } = calculatePoints(
                  waitedMinutes,
                  selectedClinic.currentWait,
                  null,
                );
                setLastCheckout({ waitedMinutes, pointsEarned });
                setPoints((prev) => prev + pointsEarned);
                setView("checkoutconfirm");
              } catch (err) {
                setDeniedReason("location");
                setDeniedValue(999);
                setView("denied");
              }
            }}
          />
        ) : null)}

        {view === "denied" && (
          <CheckoutDenied
            reason={deniedReason}
            value={deniedValue}
            onBack={() => setView("checkedin")}
          />
        )}

        {view === "checkoutconfirm" && selectedClinic && (
          <CheckoutConfirm
            clinic={selectedClinic}
            waitedMinutes={lastCheckout?.waitedMinutes}
            pointsEarned={lastCheckout?.pointsEarned}
            totalPoints={points}
            onDone={() => {
              setActiveCheckin(null);
              setView("home");
            }}
          />
        )}

        {view === "confirm" && selectedClinic && (
          <ConfirmView clinic={selectedClinic} onDone={() => setView("home")} />
        )}
      </div>
    </div>
  );
}

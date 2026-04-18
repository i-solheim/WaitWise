import { useLoadScript, GoogleMap, OverlayView } from '@react-google-maps/api';
import { severity, severityColors } from '../data/constants';

const mapContainerStyle = { width: '100%', height: '440px' };
const defaultCenter = { lat: 41.5067, lng: -90.5487 }; // Quad Cities
const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  ]
};

export default function MapView({ clinics, onClickClinic }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  if (loadError) return (
    <div className="bg-white border border-red-200 rounded-xl h-[440px] flex items-center justify-center text-sm text-red-800">
      Failed to load map
    </div>
  );

  if (!isLoaded) return (
    <div className="bg-white border border-red-200 rounded-xl h-[440px] flex items-center justify-center text-sm text-red-800">
      Loading map...
    </div>
  );

  return (
    <div className="rounded-xl overflow-hidden border border-red-200 relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={defaultCenter}
        options={mapOptions}
      >
        {clinics.map(c => {
          const s = severity(c.currentWait);
          const col = severityColors[s];
          return (
            <OverlayView
              key={c.id}
              position={{ lat: c.lat, lng: c.lng }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div
                onClick={() => onClickClinic(c.id)}
                className="cursor-pointer transition-transform hover:scale-110"
                style={{ transform: 'translate(-50%, -100%)' }}
              >
                <div className={`${col.pin} ${col.pinText} px-2.5 py-1 rounded-full text-[11px] font-medium border-2 border-white whitespace-nowrap shadow-md`}>
                  {c.currentWait}m
                </div>
                <div className={`w-3 h-3 ${col.pin} border-2 border-white rounded-full mx-auto mt-0.5 shadow`}></div>
              </div>
            </OverlayView>
          );
        })}
      </GoogleMap>

      {/* Clinic count badge */}
      <div className="absolute top-3 left-3 z-[1000] bg-white border border-red-200 rounded-lg px-2.5 py-1.5 text-[11px] text-red-900 font-medium shadow">
        Quad Cities · {clinics.length} clinics
      </div>
    </div>
  );
}
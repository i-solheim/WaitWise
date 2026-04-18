// Maximum distance allowed to check in or check out (100 meters)
export const MAX_DISTANCE_METERS = 100;

// Minimum wait time required before checking out (3 minutes = 180 seconds)
export const MIN_WAIT_SECONDS = 180;

/**
 * Haversine formula — calculates real-world distance between two GPS points
 * Returns distance in meters as a rounded integer
 */
export function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371000; // Earth's radius in meters
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Gets the user's current GPS location from the browser
 * Returns a Promise that resolves to { lat, lng }
 */
export function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(new Error('Unable to get your location: ' + error.message));
      }
    );
  });
}
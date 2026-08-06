/**
 * Real-World Geolocation & Multi-Provider Reverse Geocoding Service
 * Fast, reliable GPS location detection for desktop and mobile browsers
 */

export const getRealLocation = async () => {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) {
      return fallbackIpLocation().then(resolve);
    }

    const options = {
      enableHighAccuracy: false,
      timeout: 6000,
      maximumAge: 300000
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Try BigDataCloud Reverse Geocoding API (Fast CORS, No Key Required)
        try {
          const bdcRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
          );
          if (bdcRes.ok) {
            const bdcData = await bdcRes.json();
            const locality = bdcData.locality || bdcData.city || bdcData.principalSubdivision || 'Detected Locality';
            const fullAddress = `${locality}, ${bdcData.principalSubdivision || bdcData.countryName || ''}`;

            return resolve({
              success: true,
              lat,
              lng,
              locality,
              fullAddress,
              raw: bdcData
            });
          }
        } catch (e) {
          console.warn('BigDataCloud geocode failed, trying Nominatim fallback:', e);
        }

        // OpenStreetMap Nominatim Fallback
        try {
          const osmRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
          );
          if (osmRes.ok) {
            const osmData = await osmRes.json();
            const addr = osmData.address || {};
            const locality = addr.suburb || addr.neighbourhood || addr.city || addr.town || 'Detected Location';
            const fullAddress = osmData.display_name || `${locality}, ${addr.state || ''}`;

            return resolve({
              success: true,
              lat,
              lng,
              locality,
              fullAddress,
              raw: osmData
            });
          }
        } catch (e) {
          console.warn('OSM geocode failed:', e);
        }

        resolve({
          success: true,
          lat,
          lng,
          locality: 'GPS Position Detected',
          fullAddress: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`
        });
      },
      (error) => {
        console.warn('Browser GPS permission or timeout error:', error.message);
        fallbackIpLocation().then(resolve);
      },
      options
    );
  });
};

const fallbackIpLocation = async () => {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) throw new Error('ipapi HTTP Error');
    const data = await res.json();

    const locality = data.city || data.region || 'Detected Region';
    const fullAddress = `${locality}, ${data.region || ''}, ${data.country_name || ''}`;

    return {
      success: true,
      lat: data.latitude || 16.9891,
      lng: data.longitude || 82.2475,
      locality,
      fullAddress,
      raw: data
    };
  } catch (err) {
    return {
      success: true,
      lat: 16.9891,
      lng: 82.2475,
      locality: 'Kovada Road',
      fullAddress: 'Kovada Road, Kakinada',
      raw: null
    };
  }
};

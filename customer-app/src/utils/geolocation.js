/**
 * Real-World Geolocation & Reverse Geocoding Service
 * Uses HTML5 Geolocation API + OpenStreetMap Nominatim API (Free, no API key required)
 */

export const getRealLocation = async () => {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      return fallbackIpLocation().then(resolve).catch(reject);
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Call OpenStreetMap Nominatim Reverse Geocoding API
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
            {
              headers: {
                'Accept-Language': 'en-US,en;q=0.9',
                'User-Agent': 'SparkStockApp/1.0'
              }
            }
          );

          if (!res.ok) throw new Error('OSM Reverse Geocode HTTP Error');
          const data = await res.json();

          const addr = data.address || {};
          const locality = 
            addr.suburb || 
            addr.neighbourhood || 
            addr.residential || 
            addr.subdistrict || 
            addr.city_district || 
            addr.town || 
            addr.city || 
            'Detected Location';

          const fullAddress = data.display_name || `${locality}, ${addr.city || addr.state || ''}`;

          resolve({
            success: true,
            lat,
            lng,
            locality,
            fullAddress,
            raw: data
          });
        } catch (err) {
          console.warn('Nominatim Geocode failed, attempting IP Geolocation fallback:', err);
          fallbackIpLocation().then(resolve).catch(reject);
        }
      },
      (error) => {
        console.warn('Browser GPS permission error or denied:', error.message);
        fallbackIpLocation().then(resolve).catch(reject);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  });
};

const fallbackIpLocation = async () => {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) throw new Error('ipapi HTTP Error');
    const data = await res.json();

    const locality = data.city || data.region || 'Bengaluru';
    const fullAddress = `${data.city || ''}, ${data.region || ''}, ${data.country_name || ''} (IP Location)`;

    return {
      success: true,
      lat: data.latitude || 12.9716,
      lng: data.longitude || 77.6412,
      locality,
      fullAddress,
      raw: data
    };
  } catch (err) {
    return {
      success: true,
      lat: 12.9716,
      lng: 77.6412,
      locality: 'Indiranagar',
      fullAddress: 'Indiranagar 100ft Road, Bengaluru',
      raw: null
    };
  }
};

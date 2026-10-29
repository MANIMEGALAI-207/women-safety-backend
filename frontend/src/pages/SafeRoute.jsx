import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function SafeRoute() {
  const [currentLocation, setCurrentLocation] = useState([10.99, 76.97]);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [destination, setDestination] = useState('');
  const [route, setRoute] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation([latitude, longitude]);
      });
    }
  }, []);

  const handleFindRoute = async () => {
    if (!destination) {
      alert('Please enter a destination');
      return;
    }

    setLoading(true);

    try {
      // 1. Destination address-ah coordinates-ku maathu (Nominatim API - Free)
      const geocodeRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}`,
        { headers: { 'User-Agent': 'WomenSafetyApp' } }
      );
      const geocodeData = await geocodeRes.json();

      if (geocodeData.length === 0) {
        alert('Destination not found');
        setLoading(false);
        return;
      }

      const destCoords = [parseFloat(geocodeData[0].lat), parseFloat(geocodeData[0].lon)];
      setDestinationCoords(destCoords);

      // 2. OSRM API vachu real route edukka (Free, API Key thevai illa)
      const routeRes = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${currentLocation[1]},${currentLocation[0]};${destCoords[1]},${destCoords[0]}?overview=full&geometries=geojson`
      );
      const routeData = await routeRes.json();

      if (routeData.routes.length > 0) {
        // 3. Route-ah lat/lng pairs-ku maathu
        const coordinates = routeData.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
        setRoute(coordinates);
      }
    } catch (error) {
      console.error(error);
      alert('Route find aagala. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">🗺️ Safe Route</h1>

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <label className="block text-gray-700 font-medium mb-2">Enter Destination</label>
        <input
          type="text"
          placeholder="e.g., Coimbatore Bus Stand"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
        />
        <button
          onClick={handleFindRoute}
          disabled={loading}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Finding...' : '🛡️ Find Safe Route'}
        </button>
      </div>

      <div className="h-[500px] rounded-xl overflow-hidden shadow-lg">
        <MapContainer center={currentLocation} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          <Marker position={currentLocation}>
            <Popup>📍 Current Location</Popup>
          </Marker>

          {destinationCoords && (
            <Marker position={destinationCoords}>
              <Popup>🎯 Destination</Popup>
            </Marker>
          )}

          {route.length > 0 && (
            <Polyline positions={route} color="green" weight={5} />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
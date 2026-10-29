import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PoliceDashboard() {
  const [alerts, setAlerts] = useState([]);

  const fetchAlerts = async () => {
    try {
      const res = await axios.get('https://women-safety-backend-1-34sx.onrender.com/api/sos/list/');
      setAlerts(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000); // 5 seconds refresh
    return () => clearInterval(interval);
  }, []);

  const handleResolve = (id) => {
    // 1. INSTANT RESPONSE: Odaney alert-ah list-la irundhu remove pannu
    setAlerts(alerts.filter(a => a.id !== id));
    
    // 2. Background-la API call pannu (database update)
    axios.patch(`https://women-safety-backend-1-34sx.onrender.com/api/sos/${id}/resolve/`)
      .catch(error => {
        console.error('Resolve error:', error);
        // Error vandha, alert-ah thirumba list-la add pannu
        fetchAlerts();
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">👮 Police Dashboard</h1>
      
      {alerts.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <p className="text-gray-500">No SOS alerts currently.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
              <h2 className="text-xl font-bold text-gray-800 mb-2">🚨 {alert.user_name || 'User'}</h2>
              <p className="text-gray-600">
                📍 Location: <a href={`https://maps.google.com/?q=${alert.lat},${alert.lng}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View on Map</a>
              </p>
              <p className="text-gray-600">⏰ Time: {new Date(alert.created_at).toLocaleTimeString()}</p>
              <button
                onClick={() => handleResolve(alert.id)}
                className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-bold"
              >
                ✓ Mark Resolved
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
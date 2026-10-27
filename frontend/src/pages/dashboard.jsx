import { useState, useEffect } from 'react';
import axios from 'axios'; // Axios Import

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSOS = async () => {
    setLoading(true);
    
    if (!navigator.geolocation) {
      alert('Geolocation not supported in this browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Direct API Call to Render Backend
          await axios.post('https://women-safety-backend-1-34sx.onrender.com/api/sos/create/', {
            lat: latitude,
            lng: longitude,
          });

          setSuccess(true);
        } catch (error) {
          console.error(error);
          alert('SOS send aagala. Backend check pannunga.');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        alert('Location permission denied or failed.');
        setLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-purple-700 mb-2">🚨 Women Safety</h1>
      <p className="text-gray-600 mb-8">Press the SOS button in case of emergency</p>
      
      {success ? (
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <p className="text-2xl text-green-600 font-bold mb-4">✅ SOS Alert Sent!</p>
          <p className="text-gray-600">Police will arrive soon.</p>
        </div>
      ) : (
        <button
          onClick={handleSOS}
          disabled={loading}
          className="w-64 h-64 rounded-full bg-red-600 text-white text-4xl font-bold shadow-2xl hover:bg-red-700 transition disabled:opacity-50 animate-pulse"
        >
          {loading ? 'Sending...' : 'SOS'}
        </button>
      )}
    </div>
  );
}
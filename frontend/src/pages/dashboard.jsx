import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { sosAPI } from '../services/api';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // WebSocket connect (Django Channels)
    const ws = new WebSocket('ws://127.0.0.1:8000/ws/sos/');
    
    ws.onopen = () => {
      console.log('✅ WebSocket Connected');
      setSocket(ws);
    };

    return () => ws.close();
  }, []);

const handleSOS = async () => {
  setLoading(true);
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Location permission denied');
      setLoading(false);
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    // Ippo direct-a API call pannuvom (WebSocket venaam)
    await axios.post('https://women-safety-backend-1-34sx.onrender.com/api/sos/create/', {
      lat: latitude,
      lng: longitude,
    });

    setSuccess(true);
  } catch (error) {
    alert('SOS send aagala. Backend check pannunga.');
    console.error(error);
  } finally {
    setLoading(false);
  }
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
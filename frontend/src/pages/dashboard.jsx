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

  const handleSOS = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        
        // WebSocket vachu Police-ku alert anuppu
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: 'sos_alert',
            user: 'Test User',
            lat: latitude,
            lng: longitude,
            timestamp: new Date().toISOString(),
            message: 'Emergency! Need help!'
          }));
          setSuccess(true);
        } else {
          alert('WebSocket not connected! Please refresh.');
        }
        setLoading(false);
      }, () => {
        alert('Location permission denied.');
        setLoading(false);
      });
    } else {
      alert('Location not supported');
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
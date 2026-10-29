import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showFakeCall, setShowFakeCall] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Public folder-la irundhu ringtone load pannu
    audioRef.current = new Audio('/universfield-ringtone-091-496417.mp3');
    audioRef.current.loop = true;
  }, []);

  const handleSOS = async () => {
  setLoading(true);

  const timeout = setTimeout(() => {
  setLoading(false);
  alert('Network slow-a irukku. Please try again.');
}, 15000);

  if (!navigator.geolocation) {
    alert('Geolocation not supported in this browser.');
    clearTimeout(timeout);
    setLoading(false);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      clearTimeout(timeout);  // Success aana timeout clear pannu
      try {
        const { latitude, longitude } = position.coords;
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
      clearTimeout(timeout);  // Error aana timeout clear pannu
      alert('Location permission denied or failed. Please enable GPS.');
      setLoading(false);
    },
    { timeout: 15000 } // 5 seconds la location edukka try pannu
  );
};

  const handleFakeCall = () => {
    setShowFakeCall(true);
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.error(err));
    }
  };

  const handleDecline = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setShowFakeCall(false);
  };

  const handleAccept = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setShowFakeCall(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex flex-col items-center justify-center p-6 relative">
      <h1 className="text-4xl font-bold text-purple-700 mb-2">🚨 Women Safety</h1>
      <p className="text-gray-600 mb-8">Press the SOS button in case of emergency</p>
      
      {success ? (
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <p className="text-2xl text-green-600 font-bold mb-4">✅ SOS Alert Sent!</p>
          <p className="text-gray-600">Police will arrive soon.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <button
            onClick={handleSOS}
            disabled={loading}
            className="w-64 h-64 rounded-full bg-red-600 text-white text-4xl font-bold shadow-2xl hover:bg-red-700 transition disabled:opacity-50 animate-pulse"
          >
            {loading ? 'Sending...' : 'SOS'}
          </button>

          <button
            onClick={handleFakeCall}
            className="mt-8 bg-purple-600 text-white px-10 py-3 rounded-xl font-bold text-lg hover:bg-purple-700 transition"
          >
            📞 Fake Call
          </button>
        </div>
      )}

      {/* Fake Call UI */}
      {showFakeCall && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl text-center w-80 shadow-2xl">
            <p className="text-lg text-gray-500 mb-2">📞 Incoming Call</p>
            <p className="text-4xl font-bold text-gray-800 mb-2">Dad</p>
            <p className="text-gray-500 mb-8">+91 8973997743</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleDecline}
                className="bg-red-500 text-white px-8 py-3 rounded-full font-bold hover:bg-red-600 transition"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="bg-green-500 text-white px-8 py-3 rounded-full font-bold hover:bg-green-600 transition"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
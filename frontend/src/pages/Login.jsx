import { useState, useEffect } from 'react'; // useEffect add panniruken
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 💡 Font Load Panna Code
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://women-safety-backend-1-34sx.onrender.com/api/auth/login/', {
        username,
        password,
      });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('username', username);
      navigate('/sos'); // <-- SOS page-ku povum
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    // 💡 Main div-la font-['Poppins'] class add panniruken
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-6 font-['Poppins']">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-purple-700 text-center mb-6">Login</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg font-bold hover:bg-purple-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <button onClick={() => navigate('/register')} className="text-purple-600 underline">
            Register
          </button>
        </p>

        <p className="text-center text-gray-500 text-sm mt-4">
          Emergency?{' '}
          <button onClick={() => navigate('/sos')} className="text-red-500 underline font-bold">
            Skip Login & Go to SOS
          </button>
        </p>
      </div>
    </div>
  );
}
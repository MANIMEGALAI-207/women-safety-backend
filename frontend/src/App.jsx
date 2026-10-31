import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/dashboard';
import PoliceDashboard from './pages/PoliceDashboard';
import SafeRoute from './pages/SafeRoute';

function App() {
  return (
    <BrowserRouter>
      {/* Navbar - Login link illa */}
      <nav className="bg-purple-600 text-white p-4 flex gap-6 shadow-lg">
        <Link to="/sos" className="hover:text-pink-300 font-bold">🚨 SOS</Link>
        <Link to="/police" className="hover:text-pink-300 font-bold">👮 Police Dashboard</Link>
        <Link to="/safe-route" className="hover:text-pink-300 font-bold">🗺️ Safe Route</Link>
      </nav>

      <Routes>
        {/* Home route -> Login page */}
        <Route path="/" element={<Login />} />
        
        {/* Login route (navbar-la illa) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* SOS and other pages */}
        <Route path="/sos" element={<Dashboard />} />
        <Route path="/police" element={<PoliceDashboard />} />
        <Route path="/safe-route" element={<SafeRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
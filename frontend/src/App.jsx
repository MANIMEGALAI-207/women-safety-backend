import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PoliceDashboard from './pages/PoliceDashboard';
import SafeRoute from './pages/SafeRoute';

function App() {
  return (
    <BrowserRouter>
      {/* Navbar */}
      <nav className="bg-purple-600 text-white p-4 flex gap-6 shadow-lg">
        <Link to="/login" className="hover:text-pink-300 font-bold">🔐 Login</Link>
        <Link to="/sos" className="hover:text-pink-300 font-bold">🚨 SOS</Link>
        <Link to="/police" className="hover:text-pink-300 font-bold">👮 Police Dashboard</Link>
        <Link to="/safe-route" className="hover:text-pink-300 font-bold">🗺️ Safe Route</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sos" element={<Dashboard />} />
        <Route path="/police" element={<PoliceDashboard />} />
        <Route path="/safe-route" element={<SafeRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/dashboard';
import PoliceDashboard from './pages/PoliceDashboard';
import SafeRoute from './pages/SafeRoute';

function App() {
  return (
    <BrowserRouter>
      <nav className="bg-purple-600 text-white p-3 flex justify-around items-center shadow-lg">
  <Link to="/sos" className="flex flex-col items-center hover:text-pink-300">
    <span className="text-2xl">🚨</span>
    <span className="text-xs font-bold">SOS</span>
  </Link>
  
  <Link to="/police" className="flex flex-col items-center hover:text-pink-300">
    <span className="text-2xl">👮</span>
    <span className="text-xs font-bold">Police</span>
  </Link>
  
  <Link to="/safe-route" className="flex flex-col items-center hover:text-pink-300">
    <span className="text-2xl">🗺️</span>
    <span className="text-xs font-bold">Safe Route</span>
  </Link>
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
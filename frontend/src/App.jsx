import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import PoliceDashboard from './pages/PoliceDashboard';
import SafeRoute from './pages/SafeRoute';

function App() {
  return (
    <BrowserRouter>
      <nav className="bg-purple-600 text-white p-4 flex gap-6 shadow-lg">
        <Link to="/" className="hover:text-pink-300 font-bold">🚨 Women Safety</Link>
        <Link to="/police" className="hover:text-pink-300 font-bold">👮 Police Dashboard</Link>
        <Link to="/safe-route" className="hover:text-purple-300">🗺️ Safe Route</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/safe-route" element={<SafeRoute />} />
        <Route path="/police" element={<PoliceDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
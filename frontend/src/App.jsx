import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import PoliceDashboard from './pages/PoliceDashboard';

function App() {
  return (
    <BrowserRouter>
      <nav className="bg-purple-600 text-white p-4 flex gap-6 shadow-lg">
        <Link to="/" className="hover:text-pink-300 font-bold">🚨 Women Safety</Link>
        <Link to="/police" className="hover:text-pink-300 font-bold">👮 Police Dashboard</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/police" element={<PoliceDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
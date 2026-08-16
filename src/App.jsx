import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Droplet, Map as MapIcon, UploadCloud, Home } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import UploadReport from './pages/UploadReport';
import { simulatedReports } from './simulatedReports';

function BottomNav() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="bg-white border-t border-slate-200 flex justify-around items-center h-16 absolute bottom-0 w-full z-50 px-2 pb-safe">
      <Link to="/" className={`flex flex-col items-center justify-center w-full h-full ${path === '/' ? 'text-blue-600' : 'text-slate-400'}`}>
        <Home className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-medium">หน้าแรก</span>
      </Link>
      <div className="flex flex-col items-center justify-center w-full h-full relative -top-5">
        <Link to="/upload" className="bg-blue-600 rounded-full p-4 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-transform transform hover:scale-105">
          <UploadCloud className="w-7 h-7" />
        </Link>
        <span className="text-[10px] font-medium text-slate-500 mt-1">แจ้งปัญหา</span>
      </div>
      <Link to="/dashboard" className={`flex flex-col items-center justify-center w-full h-full ${path === '/dashboard' ? 'text-blue-600' : 'text-slate-400'}`}>
        <MapIcon className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-medium">แผนที่</span>
      </Link>
    </div>
  );
}

function App() {
  const [reports, setReports] = useState(simulatedReports);

  return (
    <Router>
      <div className="min-h-screen bg-slate-900 flex items-center justify-center font-sans p-4">
        {/* Mobile App Container */}
        <div className="w-full max-w-[400px] h-[850px] max-h-[90vh] bg-slate-50 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col border-[8px] border-slate-800">
          
          {/* Status Bar Mockup (Optional) */}
          <div className="h-6 w-full flex justify-center items-center absolute top-0 z-50 pointer-events-none">
             <div className="w-32 h-6 bg-slate-800 rounded-b-2xl"></div>
          </div>

          {/* Main Content Area */}
          <main className="flex-1 w-full overflow-y-auto pb-16 pt-6 hide-scrollbar relative z-10 bg-slate-50">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard reports={reports} setReports={setReports} />} />
              <Route path="/upload" element={<UploadReport setReports={setReports} />} />
            </Routes>
          </main>

          {/* Bottom Navigation */}
          <BottomNav />
        </div>
      </div>
    </Router>
  );
}

export default App;

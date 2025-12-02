// src/App.js (Complete Corrected File)
import React, { useEffect, useState, useCallback } from 'react'; // Import useCallback
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CreatePollPage from './pages/CreatePollPage';
import PollListPage from './pages/PollListPage';
import PollViewPage from './pages/PollViewPage';

// --- UPDATED IMPORTS FOR PARTICLES ---
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import particlesConfig from './particles-config';
// --- END OF UPDATED IMPORTS ---

import './App.css';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem('theme') || 'dark');
    };
    window.addEventListener('themeChanged', handleThemeChange);

    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []);
  
  return (
    <Router>
      <Particles
        id="tsparticles"
        key={theme} 
        init={particlesInit}
        options={particlesConfig}
      />
      
      <Header />
      <main className="app-container">
        <Routes>
          <Route path="/" element={<CreatePollPage />} />
          <Route path="/polls" element={<PollListPage />} />
          <Route path="/polls/:id" element={<PollViewPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
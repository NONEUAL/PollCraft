// src/App.js (Complete Corrected File)
import React, { useCallback } from 'react'; // Import useCallback
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CreatePollPage from './pages/CreatePollPage';
import PollListPage from './pages/PollListPage';
import PollViewPage from './pages/PollViewPage';

// --- CORRECTED IMPORTS FOR PARTICLES ---
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim"; // This is the engine loader
import particlesConfig from './particles-config';
// --- END OF CORRECTED IMPORTS ---

import './App.css';

function App() {
  
  // --- NEW, CORRECTED INITIALIZATION LOGIC ---
  const particlesInit = useCallback(async (engine) => {
    // This is where you can load presets or custom shapes
    // This loads the slim version of tsparticles
    await loadSlim(engine);
  }, []);

  const particlesLoaded = (container) => {
    console.log("Particles loaded:", container);
  };
  // --- END OF NEW LOGIC ---
  
  return (
    <Router>
      {/* --- MODIFIED PARTICLES COMPONENT --- */}
      {/* The component now takes an `init` prop instead of requiring a separate state */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
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
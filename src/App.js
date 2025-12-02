import React, { useCallback } from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CreatePollPage from './pages/CreatePollPage';
import PollListPage from './pages/PollListPage';
import PollViewPage from './pages/PollViewPage';


import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim"; // This is the engine loader
import particlesConfig from './particles-config';


import './App.css';

function App() {
  
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = (container) => {
    console.log("Particles loaded:", container);
  };

  
  return (
    <Router>
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
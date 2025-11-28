import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CreatePollPage from './pages/CreatePollPage';
import PollListPage from './pages/PollListPage';
import PollViewPage from './pages/PollViewPage'; 
import './App.css'; 

function App() {
  return (
    <Router>
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

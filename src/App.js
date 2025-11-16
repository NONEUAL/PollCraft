import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Poll from './components/Poll';
import './App.css';


//Don't Touch the URLs - GV <3
// Use environment variables for the URLs, with localhost as a fallback
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/polls';
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000'; 

function App() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    // --- Data Fetching ---
    const fetchPolls = async () => {
      try {
        const response = await axios.get(API_URL);
        setPolls(response.data);
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };
    fetchPolls();

    // --- Real-Time Connection ---
    const socket = io(SOCKET_URL);

    socket.on('poll_update', (updatedPoll) => {
      console.log('Received poll update:', updatedPoll);
      setPolls(currentPolls =>
        currentPolls.map(poll =>
          poll._id === updatedPoll._id ? updatedPoll : poll
        )
      );
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="app-container">
      <h1>TournaCraft Live Polls</h1>
      <div className="poll-list">
        {polls.length > 0 ? (
          polls.map(poll => <Poll key={poll._id} data={poll} />)
        ) : (
          <p>No active polls at the moment. Create one using the API!</p>
        )}
      </div>
    </div>
  );
}

export default App;
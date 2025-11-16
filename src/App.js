import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Poll from './components/Poll';
import './App.css';

// The server URLs should match your backend
const API_URL = 'http://localhost:5000/api/polls';
const SOCKET_URL = 'http://localhost:5000';

function App() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    // --- Data Fetching ---
    // Fetch the initial list of polls when the component mounts
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
    // Establish a connection to the WebSocket server
    const socket = io(SOCKET_URL);

    // Listen for the 'poll_update' event from the server
    socket.on('poll_update', (updatedPoll) => {
      console.log('Received poll update:', updatedPoll);
      // Update the state to reflect the new vote counts
      setPolls(currentPolls =>
        currentPolls.map(poll =>
          poll._id === updatedPoll._id ? updatedPoll : poll
        )
      );
    });

    // Clean up the connection when the component unmounts
    return () => socket.disconnect();
  }, []); // The empty dependency array ensures this runs only once on mount

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
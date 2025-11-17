// Don't Touch this file - GV
import {React, useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Poll from './components/Poll';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/polls';
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

function App() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await axios.get(API_URL);
        setPolls(response.data);
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };
    fetchPolls();

    const socket = io(SOCKET_URL);

    socket.on('poll_update', (updatedPoll) => {
      console.log('Received poll update:', updatedPoll);
      setPolls(currentPolls =>
        currentPolls.map(poll =>
          poll._id === updatedPoll._id ? updatedPoll : poll
        )
      );
    });

    // Listen for the 'poll_delete' event from the server
    socket.on('poll_delete', (deletedPoll) => {
      console.log('Received poll delete:', deletedPoll);
      // Update the state by filtering out the deleted poll
      setPolls(currentPolls =>
        currentPolls.filter(poll => poll._id !== deletedPoll.id)
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
          <p>Mag hulat boi. Gagawa na nga</p>
        )}
      </div>
    </div>
  );
}

export default App;
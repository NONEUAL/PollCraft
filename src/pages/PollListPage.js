import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Poll from '../components/Poll';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/polls';
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

const PollListPage = () => {
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
      setPolls(currentPolls =>
        currentPolls.map(poll =>
          poll._id === updatedPoll._id ? updatedPoll : poll
        )
      );
    });

    socket.on('poll_delete', (deletedPoll) => {
      setPolls(currentPolls =>
        currentPolls.filter(poll => poll._id !== deletedPoll.id)
      );
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div>
      <h1>Live Polls</h1>
      <div className="poll-list">
        {polls.length > 0 ? (
          polls.map(poll => <Poll key={poll._id} data={poll} />)
        ) : (
          <p>No active polls at the moment. Create one!</p>
        )}
      </div>
    </div>
  );
};

export default PollListPage;
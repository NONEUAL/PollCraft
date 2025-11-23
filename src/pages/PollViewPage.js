import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PollViewPage.css'; 

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/polls';

const PollViewPage = () => {
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams(); 

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get(`${API_URL}/${id}`);
        setPoll(response.data);
      } catch (err) {
        setError('Poll not found or an error occurred.');
        console.error("Error fetching single poll:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPoll();
    }
  }, [id]);

  if (loading) {
    return <div className="poll-view-container"><p>Loading poll...</p></div>;
  }

  if (error) {
    return <div className="poll-view-container error-message"><p>{error}</p></div>;
  }

  if (!poll) {
    return null; 
  }

  return (
    <div className="poll-view-container">
      <div className="poll-card-standalone">
        <h2>{poll.question}</h2>
        <p>This is where the voting interface will go.</p>
        <ul>
          {poll.options.map(option => (
            <li key={option._id}>{option.text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PollViewPage;
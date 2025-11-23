import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // Import the UUID library
import io from 'socket.io-client';
import './PollViewPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/polls';
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

const getVoterId = () => {
  let voterId = localStorage.getItem('voterId');
  if (!voterId) {
    voterId = uuidv4(); // Generate a new unique ID
    localStorage.setItem('voterId', voterId);
  }
  return voterId;
};

const PollViewPage = () => {
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const voterId = getVoterId();

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get(`${API_URL}/${id}`);
        setPoll(response.data);
        // Check if this device has already voted
        if (response.data.votedBy.includes(voterId)) {
          setHasVoted(true);
        }
      } catch (err) {
        setError('Poll not found or has expired.');
        console.error("Error fetching single poll:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPoll();
    }

    const socket = io(SOCKET_URL);
    socket.on('poll_update', (updatedPoll) => {
      // If the update is for the poll we are currently viewing...
      if (updatedPoll._id === id) {
        setPoll(updatedPoll); // ...update our state with the new data
      }
    });
    // Clean up the connection when the component unmounts
    return () => socket.disconnect();

  }, [id, voterId]);

  const handleVote = async (optionIndex) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_URL}/${id}/vote`, {
        optionIndex,
        voterId // Send the device ID with the vote
      });
      setPoll(response.data); // Update with the returned data
      setHasVoted(true); // Lock the UI
    } catch (err) {
      // If the server says we've already voted, lock the UI
      if (err.response && err.response.status === 403) {
        setHasVoted(true);
        setError("You've already voted on this poll.");
      } else {
        setError('An error occurred. Please try again.');
        console.error("Error submitting vote:", err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="poll-view-container"><p>Loading poll...</p></div>;
  if (error && !poll) return <div className="poll-view-container error-message"><p>{error}</p></div>;
  if (!poll) return null;

  const totalVotes = poll.options.reduce((acc, option) => acc + option.votes, 0);

  return (
    <div className="poll-view-container">
      <div className={`poll-card-standalone ${hasVoted ? 'results-view' : ''}`}>
        <h2>{poll.question}</h2>
        {error && <p className="error-message">{error}</p>}

        <ul className="options-list-standalone">
          {poll.options.map((option, index) => {
            const votePercentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
            return (
              <li key={option._id}>
                <button
                  className="option-button-standalone"
                  onClick={() => handleVote(index)}
                  disabled={hasVoted || isSubmitting}
                >
                  <span className="option-text">{option.text}</span>
                  {hasVoted && <span className="option-votes">{option.votes} votes</span>}
                </button>
                {hasVoted && (
                  <div className="vote-bar-container-standalone">
                    <div className="vote-bar-standalone" style={{ width: `${votePercentage}%` }}></div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        {hasVoted && <p className="total-votes">Total Votes: {totalVotes}</p>}
      </div>
    </div>
  );
};

export default PollViewPage;
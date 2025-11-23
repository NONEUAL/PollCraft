import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import io from 'socket.io-client';
import './PollViewPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/polls';
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

// Helper function to get or create a unique voter ID from localStorage
const getVoterId = () => {
  let voterId = localStorage.getItem('voterId');
  if (!voterId) {
    voterId = uuidv4();
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
        // Check if this device has already voted type shii 
        if (response.data.votedBy.includes(voterId)) {
          setHasVoted(true);
        }
      } catch (err) {
        console.error("Error fetching single poll:", err);
        setError('This poll may not exist or has expired.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPoll();
    }

    // Set up real-time connection
    const socket = io(SOCKET_URL);
    
    // Listen for updates to this specific poll
    socket.on('poll_update', (updatedPoll) => {
      if (updatedPoll._id === id) {
        setPoll(updatedPoll);
      }
    });

    // Listen for when this specific poll is deleted by another user
    socket.on('poll_delete', (deletedPoll) => {
        if (deletedPoll.id === id) {
            setError('This poll has been deleted by the creator.');
            setPoll(null); // Clear the poll data to trigger the error view
        }
    });

    // Clean up the connection when the component unmounts
    return () => socket.disconnect();
  }, [id, voterId]);

  const handleVote = async (optionIndex) => {
    setIsSubmitting(true);
    setError(''); // Clear previous errors on a new attempt
    try {
      const response = await axios.post(`${API_URL}/${id}/vote`, {
        optionIndex,
        voterId // Send the device ID with the vote
      });
      setPoll(response.data);
      setHasVoted(true);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setHasVoted(true); // Lock the UI if server confirms vote exists
        // Don't show an error, just show the results.
      } else {
        setError('Your vote could not be submitted. Please try again.');
        console.error("Error submitting vote:", err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Go spin the shii 

  if (loading) {
    return (
      <div className="poll-view-container">
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="poll-view-container">
        <div className="page-error-message">
          <h2>Oops!</h2>
          <p>{error || 'Could not load the poll.'}</p>
        </div>
      </div>
    );
  }

  const totalVotes = poll.options.reduce((acc, option) => acc + option.votes, 0);

  return (
    <div className="poll-view-container">
      <div className={`poll-card-standalone ${hasVoted ? 'results-view' : ''}`}>
        <h2>{poll.question}</h2>
        {/* We can show a specific vote submission error here if needed */}
        {error && !poll && <p className="error-message">{error}</p>}

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
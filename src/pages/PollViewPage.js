import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import io from 'socket.io-client';
import './PollViewPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/polls';
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

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

  const [timeLeft, setTimeLeft] = useState({ percentage: 100, text: 'Loading...' });
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get(`${API_URL}/${id}`);
        setPoll(response.data);
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

    const socket = io(SOCKET_URL);
    socket.on('poll_update', (updatedPoll) => {
      if (updatedPoll._id === id) {
        setPoll(updatedPoll);
      }
    });
    
    socket.on('poll_delete', (deletedPoll) => {
      if (deletedPoll.id === id) {
        setError('This poll has been deleted.');
        setPoll(null);
      }
    });

    return () => socket.disconnect();
  }, [id, voterId]);

  useEffect(() => {
    if (!poll || !poll.expiresAt) {
      // If the poll has no expiration, we don't need a timer.
      setTimeLeft({ percentage: 100, text: 'No time limit' });
      return;
    }
    // Set up an interval to update the timer every second
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expirationTime = new Date(poll.expiresAt).getTime();
      const creationTime = new Date(poll.createdAt).getTime();
      
      const totalDuration = expirationTime - creationTime;
      const remainingTime = expirationTime - now;

      if (remainingTime <= 0) {
        setTimeLeft({ percentage: 0, text: 'Poll has ended' });
        clearInterval(interval);
      } else {
        const percentage = (remainingTime / totalDuration) * 100;
        
        // Format the remaining time into a readable string (mm:ss)
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
        const text = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} left`;

        setTimeLeft({ percentage, text });
      }
    }, 1000);

    // Clean up the interval when the component unmounts or the poll changes
    return () => clearInterval(interval);

  }, [poll]); // This effect re-runs whenever the poll data changes

  const handleVote = async (optionIndex) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_URL}/${id}/vote`, {
        optionIndex,
        voterId
      });
      setPoll(response.data);
      setHasVoted(true);
    } catch (err) {
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

  if (loading) {
    return (
      <div className="poll-view-container">
        <div className="loading-container"><div className="spinner"></div></div>
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
        
        {poll.expiresAt && (
          <div className="timer-bar-container">
            <div className="timer-bar" style={{ width: `${timeLeft.percentage}%` }}></div>
            <span className="timer-text">{timeLeft.text}</span>
          </div>
        )}

        
        <h2>{poll.question}</h2>
        {error && !hasVoted && <p className="error-message">{error}</p>}

        <ul className="options-list-standalone">
          {poll.options.map((option, index) => {
            const votePercentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
            return (
              <li key={option._id}>
                <button
                  className="option-button-standalone"
                  onClick={() => handleVote(index)}
                  disabled={hasVoted || isSubmitting || timeLeft.percentage <= 0}
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
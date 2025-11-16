// Don't Touch This File - GV 
import React from 'react';
import axios from 'axios';

// API base URL should match your backend server address
const API_URL = 'http://localhost:5000/api/polls';

const Poll = ({ data }) => {
  // Calculate the total number of votes for this poll
  const totalVotes = data.options.reduce((acc, option) => acc + option.votes, 0);

  // Handle the vote submission
  const handleVote = async (optionIndex) => {
    try {
      // Send a POST request to the backend's vote endpoint
      await axios.post(`${API_URL}/${data._id}/vote`, { optionIndex });
      // NOTE: We don't update the state here. The WebSocket event will trigger the update.
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  };

  return (
    <div className="poll-card">
      <h2>{data.question}</h2>
      <p>Created by: {data.createdBy} {data.bracketMatchId && `(Match ID: ${data.bracketMatchId})`}</p>
      <ul className="options-list">
        {data.options.map((option, index) => {
          // Calculate the perecntage for the result bar
          const votePercentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;

          return (
            <li key={index} className="option-item">
              <button className="option-button" onClick={() => handleVote(index)}>
                {option.text}
                <span>{option.votes} votes</span>
              </button>
              <div className="vote-bar-container">
                <div className="vote-bar" style={{ width: `${votePercentage}%` }}></div>
              </div>
            </li>
          );
        })}
      </ul>
      <small>Total Votes: {totalVotes}</small>
    </div>
  );
};

export default Poll;
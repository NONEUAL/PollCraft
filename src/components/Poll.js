// Don't Touch This File - GV 
// src/components/Poll.js
import React from 'react';
import axios from 'axios';

// The API base URL should match your backend server address
// This line ensures it uses the production URL when deployed
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/polls';

const Poll = ({ data }) => {
  // Calculate the total number of votes for this poll
  const totalVotes = data.options.reduce((acc, option) => acc + option.votes, 0);

  // Handle the vote submission
  const handleVote = async (optionIndex) => {
    try {
      // THE FIX IS HERE: Ensure the URL is constructed from the API_URL variable
      await axios.post(`${API_URL}/${data._id}/vote`, { optionIndex });
    } catch (error) {
      // We are adding a more descriptive error log
      console.error("Error submitting vote:", error.response || error.message);
    }
  };

  return (
    <div className="poll-card">
      <h2>{data.question}</h2>
      <p>Created by: {data.createdBy} {data.bracketMatchId && `(Match ID: ${data.bracketMatchId})`}</p>
      <ul className="options-list">
        {data.options.map((option, index) => {
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
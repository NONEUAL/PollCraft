// Don't Touch this file - GV
import React from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/polls';

const Poll = ({ data }) => {
  const totalVotes = data.options.reduce((acc, option) => acc + option.votes, 0);

  const handleVote = async (optionIndex) => {
    try {
      await axios.post(`${API_URL}/${data._id}/vote`, { optionIndex });
    } catch (error) {
      console.error("Error submitting vote:", error.response || error.message);
    }
  };

  const handleDelete = async () => {
    // Add a confirmation dialog for better UX
    if (window.confirm("Are you sure you want to delete this poll?")) {
      try {
        await axios.delete(`${API_URL}/${data._id}`);
        // NOTE: We don't remove it from the state here. The WebSocket will do it.
      } catch (error) {
        console.error("Error deleting poll:", error.response || error.message);
      }
    }
  };

  return (
    <div className="poll-card">
      {}
      <div className="poll-card-header">
        <div>
          <h2>{data.question}</h2>
          <p>Created by: {data.createdBy} {data.bracketMatchId && `(Match ID: ${data.bracketMatchId})`}</p>
        </div>
        <button className="delete-button" onClick={handleDelete}>DELETE</button>
      </div>
      {},
      
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
import React, { useState } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/polls';

const CreatePollPage = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [timerDuration, setTimerDuration] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPollId, setNewPollId] = useState(null);


  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };
  
  const resetForm = () => {
    setQuestion('');
    setOptions(['', '']);
    setTimerDuration('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!question.trim()) {
      setError('Please enter a question.');
      return;
    }
    const filledOptions = options.map(opt => opt.trim()).filter(opt => opt !== '');
    if (filledOptions.length < 2) {
      setError('Please provide at least two non-empty options.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(API_URL, {
        question,
        options: filledOptions,
        timerDuration: timerDuration || null
      });

      setNewPollId(response.data._id); 
      setIsModalOpen(true); 
      resetForm(); 

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create poll. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <> {/* Use a fragment to render Modal alongside the page */}
      <div className="create-poll-container">
        <h1>Create a New Poll</h1>
        <form onSubmit={handleSubmit} className="poll-form">
          <div className="form-group">
            <label htmlFor="question">Poll Question</label>
            <input
              type="text"
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., Who will win the next match?"
            />
          </div>

          <div className="form-group">
            <label>Options</label>
            {options.map((option, index) => (
              <div key={index} className="option-input-group">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                {options.length > 2 && (
                  <button type="button" onClick={() => removeOption(index)} className="remove-option-btn">
                    &times;
                  </button>
                )}
              </div>
            ))}
            {options.length < 10 && (
              <button type="button" onClick={addOption} className="add-option-btn">
                + Add Option
              </button>
            )}
          </div>

          <div className="form-group">
            {/* --- UI TEXT CHANGE --- */}
            <label htmlFor="timer">Poll Duration (Optional)</label>
            <select id="timer" value={timerDuration} onChange={(e) => setTimerDuration(e.target.value)}>
              <option value="">No time limit</option>
              <option value="5">5 Minutes</option>
              <option value="30">30 Minutes</option>
              <option value="60">1 Hour</option>
              <option value="1440">1 Day</option>
            </select>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="submit-poll-btn" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Poll'}
          </button>
        </form>
      </div>
      
      {/* --- RENDER THE MODAL CONDITIONALLY --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        pollId={newPollId} 
      />
    </>
  );
};

export default CreatePollPage;
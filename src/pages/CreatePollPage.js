// src/pages/CreatePollPage.js (Complete Corrected File)
import React, { useState } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/polls';

// 3AM things
const missingOptionsErrors = [
  "Buti pwede ka pang maglagay ng options, ‘edit/save’… sana ganun din ako sa’yo, para na-edit ko sana yung naramdaman ko.",
  "Buti pwede ka pang maglagay ng options, ‘add more’… pero sa puso ko, wala nang space para sa’yo.",
  "Buti pwede ka pang maglagay ng options, ‘try again’… pero sa pagmamahal ko sa’yo, wala nang second chance.",
  "Buti pwede ka pang maglagay ng options, ‘fix’… pero yung relasyon natin, di na kayang ayusin.",
  "Buti pwede ka pang maglagay ng options, ‘next time’… pero sa akin, ikaw na lang ang huling pagkakataon ko.",
  "Buti pwede ka pang maglagay ng options, ‘more choices’… pero sa puso ko, ikaw lang ang gusto ko.",
  "Mag-lagay ka ng options, pero ako wala sa choices mo.",
  "Mag-lagay ka ng options, pero sa huli, ako pa rin ang dini-delete mo.",
  "Buti pwede ka pang maglagay ng options, ‘try again’… sana ganun din ako sa’yo, para may chance pa ko.",
  "Buti pwede ka pang maglagay ng options, ‘add more’… pero sa puso ko, wala nang space para sa’yo.",
  // "Kailangan ng tanong, parang sa relasyon, kailangan ng label.",
  // "Anong ipapa-vote mo kung walang tanong? Isip-isip din 'pag may time.",
  // "Lagyan mo ng tanong. Huwag mo akong paasahin.",
  // "Ang poll na walang tanong ay parang pag-ibig na walang patutunguhan. Walang saysay."
];


const CreatePollPage = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [timerDuration, setTimerDuration] = useState('');
  const [hideResults, setHideResults] = useState(false);
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
    setHideResults(false);
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
      const randomIndex = Math.floor(Math.random() * missingOptionsErrors.length);
      setError(missingOptionsErrors[randomIndex]);
      return;
    }


    setIsLoading(true);
    try {
      const response = await axios.post(API_URL, {
        question,
        options: filledOptions,
        timerDuration: timerDuration || null,
        resultsVisibility: hideResults ? 'hidden' : 'public'
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
    <>
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
            <label htmlFor="timer">Poll Duration (Optional)</label>
            <select id="timer" value={timerDuration} onChange={(e) => setTimerDuration(e.target.value)}>
              <option value="">No time limit</option>
              <option value="5">5 Minutes</option>
              <option value="30">30 Minutes</option>
              <option value="60">1 Hour</option>
              <option value="1440">1 Day</option>
            </select>
          </div>

          <div className="form-group settings-group">
             <label className="checkbox-label">
                <input 
                    type="checkbox" 
                    checked={hideResults}
                    onChange={(e) => setHideResults(e.target.checked)}
                />
                Hide results from voters
             </label>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="submit-poll-btn" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Poll'}
          </button>
        </form>
      </div>
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        pollId={newPollId} 
      />
    </>
  );
};

export default CreatePollPage;
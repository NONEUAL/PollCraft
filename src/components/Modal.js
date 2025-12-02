import React, { useState } from 'react';
import './Modal.css'; 

const Modal = ({ isOpen, onClose, pollId }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copy Link');
  
  if (!isOpen) {
    return null;
  }

  const pollLink = `${window.location.origin}/polls/${pollId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pollLink).then(() => {
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy Link'), 2000); 
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2>Poll Created Successfully!</h2>
        <div className="share-link-container">
          <input type="text" value={pollLink} readOnly />
          <button onClick={handleCopy}>{copyButtonText}</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
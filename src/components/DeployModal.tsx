import React, { useState, useEffect } from 'react';
import './DeployModal.css';

const DeployModal = ({ isOpen, onClose, onDeploy }) => {
  const [repoOwner, setRepoOwner] = useState('');
  const [repoName, setRepoName] = useState('');
  const [branch, setBranch] = useState('gh-pages');
  const [token, setToken] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onDeploy({ repoOwner, repoName, branch, token });
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setRepoOwner('');
      setRepoName('');
      setBranch('gh-pages');
      setToken('');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h4>Deploy to GitHub Pages</h4>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <label htmlFor="repoOwner">GitHub Username</label>
            <input
              id="repoOwner"
              type="text"
              value={repoOwner}
              onChange={(e) => setRepoOwner(e.target.value)}
              required
            />
          </div>
          <div className="input-field">
            <label htmlFor="repoName">Repository Name</label>
            <input
              id="repoName"
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              required
            />
          </div>
          <div className="input-field">
            <label htmlFor="branch">Branch</label>
            <input
              id="branch"
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              required
            />
          </div>
          <div className="input-field">
            <label htmlFor="token">GitHub Personal Access Token</label>
            <input
              id="token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn">Deploy</button>
        </form>
      </div>
    </div>
  );
};

export default DeployModal;

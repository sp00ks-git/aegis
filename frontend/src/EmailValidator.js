import React, { useState } from 'react';

const EmailValidator = () => {
  const [email, setEmail] = useState('');
  const [results, setResults] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const response = await fetch('/api/email-validator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`,
      },
      body: new URLSearchParams({ email }),
    });
    const data = await response.json();
    setResults(data);
  };

  return (
    <div className="osint-tool">
      <h2>Email Validator</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter an email address"
          required
        />
        <button type="submit">Validate</button>
      </form>
      {results && (
        <div className="results">
          <h3>Results for {results.email}:</h3>
          <p>Valid: {results.valid ? 'Yes' : 'No'}</p>
          {results.error && <p>Error: {results.error}</p>}
        </div>
      )}
    </div>
  );
};

export default EmailValidator;

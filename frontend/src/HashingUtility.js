import React, { useState } from 'react';

const HashingUtility = () => {
  const [text, setText] = useState('');
  const [results, setResults] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const response = await fetch('/api/hashing-utility', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`,
      },
      body: new URLSearchParams({ text }),
    });
    const data = await response.json();
    setResults(data);
  };

  return (
    <div className="osint-tool">
      <h2>Hashing Utility</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to hash"
          required
        />
        <button type="submit">Hash</button>
      </form>
      {results && (
        <div className="results">
          <h3>Hashes:</h3>
          <ul>
            {Object.entries(results.hashes).map(([key, value]) => (
              <li key={key}><strong>{key.toUpperCase()}:</strong> {value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HashingUtility;

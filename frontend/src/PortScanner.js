import React, { useState } from 'react';

const PortScanner = () => {
  const [host, setHost] = useState('');
  const [results, setResults] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const response = await fetch('/api/port-scanner', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`,
      },
      body: new URLSearchParams({ host }),
    });
    const data = await response.json();
    setResults(data);
  };

  return (
    <div className="osint-tool">
      <h2>Port Scanner</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={host}
          onChange={(e) => setHost(e.target.value)}
          placeholder="Enter a host (IP or domain)"
          required
        />
        <button type="submit">Scan</button>
      </form>
      {results && (
        <div className="results">
          <h3>Open ports for {results.host}:</h3>
          <ul>
            {results.open_ports.map((port) => (
              <li key={port}>{port}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PortScanner;

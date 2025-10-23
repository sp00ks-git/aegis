import React, { useState } from 'react';

const DNSLookup = () => {
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const response = await fetch('/api/dns-lookup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`,
      },
      body: new URLSearchParams({ domain }),
    });
    const data = await response.json();
    setResults(data);
  };

  return (
    <div className="osint-tool">
      <h2>DNS Lookup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Enter a domain name"
          required
        />
        <button type="submit">Lookup</button>
      </form>
      {results && (
        <div className="results">
          <h3>DNS Records for {results.domain}:</h3>
          <ul>
            {Object.entries(results.records).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong>
                <ul>
                  {value.map((record, index) => (
                    <li key={index}>{record}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DNSLookup;

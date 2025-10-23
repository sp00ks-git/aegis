import React, { useState } from 'react';

const WHOISLookup = () => {
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const response = await fetch('/api/whois-lookup', {
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
      <h2>WHOIS Lookup</h2>
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
          <h3>WHOIS Information for {results.domain}:</h3>
          <pre>{JSON.stringify(results.whois, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default WHOISLookup;

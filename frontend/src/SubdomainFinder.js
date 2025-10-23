import React, { useState } from 'react';

const SubdomainFinder = () => {
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const response = await fetch('/api/subdomain-finder', {
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
      <h2>Subdomain Finder</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Enter a domain name"
          required
        />
        <button type="submit">Find</button>
      </form>
      {results && (
        <div className="results">
          <h3>Subdomains for {results.domain}:</h3>
          <ul>
            {results.subdomains.map((subdomain) => (
              <li key={subdomain}>{subdomain}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SubdomainFinder;

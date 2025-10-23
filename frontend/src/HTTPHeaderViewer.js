import React, { useState } from 'react';

const HTTPHeaderViewer = () => {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const response = await fetch('/api/http-header-viewer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`,
      },
      body: new URLSearchParams({ url }),
    });
    const data = await response.json();
    setResults(data);
  };

  return (
    <div className="osint-tool">
      <h2>HTTP Header Viewer</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter a URL"
          required
        />
        <button type="submit">View Headers</button>
      </form>
      {results && (
        <div className="results">
          <h3>Headers for {url}:</h3>
          <ul>
            {Object.entries(results.headers).map(([key, value]) => (
              <li key={key}><strong>{key}:</strong> {value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HTTPHeaderViewer;

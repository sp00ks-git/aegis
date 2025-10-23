import React, { useState } from 'react';

const IPGeolocation = () => {
  const [ip, setIp] = useState('');
  const [results, setResults] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const response = await fetch('/api/ip-geolocation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`,
      },
      body: new URLSearchParams({ ip }),
    });
    const data = await response.json();
    setResults(data);
  };

  return (
    <div className="osint-tool">
      <h2>IP Geolocation</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="Enter an IP address"
          required
        />
        <button type="submit">Geolocate</button>
      </form>
      {results && (
        <div className="results">
          <h3>Geolocation for {results.ip}:</h3>
          <pre>{JSON.stringify(results.location, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default IPGeolocation;

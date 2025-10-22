import React, { useState, useEffect } from 'react';

const ThreatAttempts = () => {
  const [threats, setThreats] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:8000/api/threats', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setThreats(data));
  }, []);

  return (
    <div>
      <h2>Threat Attempts</h2>
      <table>
        <thead>
          <tr>
            <th>IP Address</th>
            <th>Location</th>
            <th>Timestamp</th>
            <th>Google Maps</th>
          </tr>
        </thead>
        <tbody>
          {threats.map((threat, index) => (
            <tr key={index}>
              <td>{threat.ip_address}</td>
              <td>{threat.location}</td>
              <td>{threat.timestamp}</td>
              <td>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${threat.location}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Google Maps
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ThreatAttempts;

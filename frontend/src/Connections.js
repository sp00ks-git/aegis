import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';

const Connections = () => {
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    fetch('/api/connections')
      .then((res) => res.json())
      .then((data) => setConnections(data));
  }, []);

  return (
    <div>
      <Navigation />
      <h2>Connections</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>IP Address</th>
            <th>Location</th>
            <th>Timestamp</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {connections.map((connection) => (
            <tr key={connection.id}>
              <td>{connection.id}</td>
              <td>{connection.ip_address}</td>
              <td>{connection.location}</td>
              <td>{connection.timestamp}</td>
              <td>{connection.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Connections;

import React, { useState, useEffect } from 'react';

const Login = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const startTime = Date.now();

    const logConnection = (location, duration) => {
      fetch('/api/connections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location,
          duration,
        }),
      });
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            logConnection(`${latitude}, ${longitude}`, 0);
          },
          () => {
            fetch('https://ipapi.co/json/')
              .then((res) => res.json())
              .then((data) => {
                logConnection(data.city, 0);
              });
          }
        );
      }
    };

    getLocation();

    return () => {
      const duration = Date.now() - startTime;
      logConnection(null, duration);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'sp00ks' && password === 'Th3devilisn3ar@@*&') {
      setAuth(true);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;

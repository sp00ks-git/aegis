import React, { useState } from 'react';

const PhoneNumberInfo = () => {
  const [phone, setPhone] = useState('');
  const [results, setResults] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const response = await fetch('/api/phone-number-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`,
      },
      body: new URLSearchParams({ phone }),
    });
    const data = await response.json();
    setResults(data);
  };

  return (
    <div className="osint-tool">
      <h2>Phone Number Information</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter a phone number"
          required
        />
        <button type="submit">Get Info</button>
      </form>
      {results && (
        <div className="results">
          <h3>Information for {phone}:</h3>
          <p>Country: {results.country}</p>
          <p>Carrier: {results.carrier}</p>
          <p>Timezone: {results.timezone}</p>
        </div>
      )}
    </div>
  );
};

export default PhoneNumberInfo;

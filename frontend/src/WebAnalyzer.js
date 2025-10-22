import React, { useState } from 'react';

const WebAnalyzer = () => {
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8000/api/analyze-url?url=${url}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setAnalysis(data);
    }
  };

  return (
    <div>
      <h2>Web Page Analyzer</h2>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL"
      />
      <button onClick={handleAnalyze}>Analyze</button>
      {analysis && (
        <div>
          <h3>Screenshot</h3>
          <img src={`data:image/png;base64,${analysis.screenshot}`} alt="Screenshot" />
          <h3>Text</h3>
          <p>{analysis.text}</p>
          <h3>Links</h3>
          <ul>
            {analysis.links.map((link, index) => (
              <li key={index}>
                <a href={link}>{link}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WebAnalyzer;

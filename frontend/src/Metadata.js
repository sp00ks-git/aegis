import React, { useState } from 'react';
import EXIF from 'exif-js';

const Metadata = () => {
  const [metadata, setMetadata] = useState(null);
  const [ip, setIp] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      EXIF.getData(file, function () {
        const allMetaData = EXIF.getAllTags(this);
        setMetadata(allMetaData);
      });
    }
  };

  useState(() => {
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        setIp(data.ip);
      });
  }, []);

  return (
    <div>
      <h2>Metadata</h2>
      <input type="file" onChange={handleFileUpload} />
      {ip && <p>Your IP Address: {ip}</p>}
      {metadata && (
        <table>
          <thead>
            <tr>
              <th>Property</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(metadata).map(([key, value]) => (
              <tr key={key}>
                <td>{key}</td>
                <td>{value.toString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Metadata;

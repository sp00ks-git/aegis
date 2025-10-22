import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

const Pastebin = () => {
  const [text, setText] = useState('');
  const [files, setFiles] = useState([]);
  const [password, setPassword] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newFiles = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const encrypted = CryptoJS.AES.encrypt(reader.result, password).toString();
        newFiles.push({
          name: file.name,
          encryptedContent: encrypted,
        });
        if (newFiles.length === files.length) {
          setUploadedFiles([...uploadedFiles, ...newFiles]);
          setFiles([]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDownload = (file) => {
    const decrypted = CryptoJS.AES.decrypt(file.encryptedContent, password).toString(CryptoJS.enc.Utf8);
    const a = document.createElement('a');
    a.href = decrypted;
    a.download = file.name;
    a.click();
  };

  return (
    <div>
      <h2>Pastebin</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="10"
          cols="50"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <br />
        <input type="file" multiple onChange={handleFileChange} />
        <br />
        <input
          type="password"
          placeholder="Encryption Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Submit</button>
      </form>
      <h3>Uploaded Files</h3>
      <ul>
        {uploadedFiles.map((file, index) => (
          <li key={index}>
            <button onClick={() => handleDownload(file)}>{file.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pastebin;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';
import hamburger from './hamburger.svg';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <img src={hamburger} alt="Menu" />
      </button>
      <nav className={`nav ${isOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <Link to="/connections">Connections</Link>
          </li>
          <li>
            <Link to="/camera-mic">Camera and Mic</Link>
          </li>
          <li>
            <Link to="/metadata">Metadata</Link>
          </li>
          <li>
            <Link to="/pastebin">Pastebin</Link>
          </li>
          <li>
            <Link to="/web-analyzer">Web Page Analyzer</Link>
          </li>
          <li>
            <Link to="/threat-attempts">Threat Attempts</Link>
          </li>
          <li>
            <Link to="/map">Map</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navigation;

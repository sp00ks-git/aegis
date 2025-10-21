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
        </ul>
      </nav>
    </>
  );
};

export default Navigation;

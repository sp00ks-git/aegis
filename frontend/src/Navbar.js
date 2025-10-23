import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/connections">Connections</Link></li>
        <li><Link to="/camera-mic">Camera/Mic</Link></li>
        <li><Link to="/metadata">Metadata</Link></li>
        <li><Link to="/pastebin">Pastebin</Link></li>
        <li><Link to="/web-analyzer">Web Analyzer</Link></li>
        <li><Link to="/threat-attempts">Threats</Link></li>
        <li><Link to="/map">Map</Link></li>
        <li><Link to="/email-validator">Email Validator</Link></li>
        <li><Link to="/username-searcher">Username Searcher</Link></li>
        <li><Link to="/phone-number-info">Phone Info</Link></li>
        <li><Link to="/ip-geolocation">IP Geolocation</Link></li>
        <li><Link to="/whois-lookup">WHOIS Lookup</Link></li>
        <li><Link to="/subdomain-finder">Subdomain Finder</Link></li>
        <li><Link to="/dns-lookup">DNS Lookup</Link></li>
        <li><Link to="/port-scanner">Port Scanner</Link></li>
        <li><Link to="/http-header-viewer">Header Viewer</Link></li>
        <li><Link to="/hashing-utility">Hashing Utility</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;

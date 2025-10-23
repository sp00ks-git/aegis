import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Connections from './Connections';
import CameraMic from './CameraMic';
import Metadata from './Metadata';
import Pastebin from './Pastebin';
import WebAnalyzer from './WebAnalyzer';
import ThreatAttempts from './ThreatAttempts';
import Map from './Map';
import EmailValidator from './EmailValidator';
import UsernameSearcher from './UsernameSearcher';
import PhoneNumberInfo from './PhoneNumberInfo';
import IPGeolocation from './IPGeolocation';
import WHOISLookup from './WHOISLookup';
import SubdomainFinder from './SubdomainFinder';
import DNSLookup from './DNSLookup';
import PortScanner from './PortScanner';
import HTTPHeaderViewer from './HTTPHeaderViewer';
import HashingUtility from './HashingUtility';

const AppRouter = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  return (
    <Routes>
      <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
      <Route path="/connections" element={isAuthenticated ? <Connections /> : <Navigate to="/login" />} />
      <Route path="/camera-mic" element={isAuthenticated ? <CameraMic /> : <Navigate to="/login" />} />
      <Route path="/metadata" element={isAuthenticated ? <Metadata /> : <Navigate to="/login" />} />
      <Route path="/pastebin" element={isAuthenticated ? <Pastebin /> : <Navigate to="/login" />} />
      <Route path="/web-analyzer" element={isAuthenticated ? <WebAnalyzer /> : <Navigate to="/login" />} />
      <Route path="/threat-attempts" element={isAuthenticated ? <ThreatAttempts /> : <Navigate to="/login" />} />
      <Route path="/map" element={isAuthenticated ? <Map /> : <Navigate to="/login" />} />
      <Route path="/email-validator" element={isAuthenticated ? <EmailValidator /> : <Navigate to="/login" />} />
      <Route path="/username-searcher" element={isAuthenticated ? <UsernameSearcher /> : <Navigate to="/login" />} />
      <Route path="/phone-number-info" element={isAuthenticated ? <PhoneNumberInfo /> : <Navigate to="/login" />} />
      <Route path="/ip-geolocation" element={isAuthenticated ? <IPGeolocation /> : <Navigate to="/login" />} />
      <Route path="/whois-lookup" element={isAuthenticated ? <WHOISLookup /> : <Navigate to="/login" />} />
      <Route path="/subdomain-finder" element={isAuthenticated ? <SubdomainFinder /> : <Navigate to="/login" />} />
      <Route path="/dns-lookup" element={isAuthenticated ? <DNSLookup /> : <Navigate to="/login" />} />
      <Route path="/port-scanner" element={isAuthenticated ? <PortScanner /> : <Navigate to="/login" />} />
      <Route path="/http-header-viewer" element={isAuthenticated ? <HTTPHeaderViewer /> : <Navigate to="/login" />} />
      <Route path="/hashing-utility" element={isAuthenticated ? <HashingUtility /> : <Navigate to="/login" />} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRouter;

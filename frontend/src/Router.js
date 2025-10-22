import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Connections from './Connections';
import CameraMic from './CameraMic';
import Metadata from './Metadata';
import Pastebin from './Pastebin';
import WebAnalyzer from './WebAnalyzer';
import ThreatAttempts from './ThreatAttempts';
import Map from './Map';

const AppRouter = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
        <Route path="/connections" element={isAuthenticated ? <Connections /> : <Navigate to="/login" />} />
        <Route path="/camera-mic" element={isAuthenticated ? <CameraMic /> : <Navigate to="/login" />} />
        <Route path="/metadata" element={isAuthenticated ? <Metadata /> : <Navigate to="/login" />} />
        <Route path="/pastebin" element={isAuthenticated ? <Pastebin /> : <Navigate to="/login" />} />
        <Route path="/web-analyzer" element={isAuthenticated ? <WebAnalyzer /> : <Navigate to="/login" />} />
        <Route path="/threat-attempts" element={isAuthenticated ? <ThreatAttempts /> : <Navigate to="/login" />} />
        <Route path="/map" element={isAuthenticated ? <Map /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;

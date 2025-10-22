import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Connections from './Connections';
import CameraMic from './CameraMic';
import Metadata from './Metadata';

const AppRouter = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
        <Route path="/connections" element={isAuthenticated ? <Connections /> : <Navigate to="/login" />} />
        <Route path="/camera-mic" element={isAuthenticated ? <CameraMic /> : <Navigate to="/login" />} />
        <Route path="/metadata" element={isAuthenticated ? <Metadata /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;

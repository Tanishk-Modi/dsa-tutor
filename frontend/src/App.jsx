import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid'; 
import Session from './pages/Session';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the editor session */}
        <Route path="/session/:roomId" element={<Session />} />
        
        {/* Redirect from the home page to a new session */}
        <Route path="*" element={<Navigate to={`/session/${uuidV4()}`} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
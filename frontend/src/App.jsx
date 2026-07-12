/* Auth.jsx
Alfie Staunton
03.07.26
*/

import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

//app pages
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* App opens up on login/reg screen by default*/}
        <Route path="/" element={<Auth />} />

        {/* Dashboard page */}
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

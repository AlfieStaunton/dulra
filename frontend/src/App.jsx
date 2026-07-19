/* Auth.jsx
Alfie Staunton
03.07.26
*/

import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

//app pages
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import SurveySitesOnBoarding from '.pages/SurveySitesOnBoarding';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        {/* App opens up on login/reg screen by default*/}
        <Route path="/" element={<Auth />} />
       {/* onboarding page automatic redirection after registering*/}
        <Route path="/onboarding" element={<SurveySitesOnBoarding />} />
        {/* Dashboard page */}
        <Route path="/Dashboard" element={<Dashboard />} />
        {/* settings page */}
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;

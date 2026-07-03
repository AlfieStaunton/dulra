/* Auth.jsx
Alfie Staunton
03.07.26
*/

import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Auth from './pages/Auth';

function App() {
  return (
    <Router>
      <Routes>
        {/* App opens up on login/reg screen by default*/}
        <Route path="/" element={<Auth />} />
      </Routes>
    </Router>
  );
}

export default App;

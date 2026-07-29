/* App.jsx
Alfie Staunton
03.07.26
*/

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";



//app pages
import Auth from "./pages/Auth";
import SurveySitesOnBoarding from "./pages/SurveySitesOnBoarding";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Guides from "./pages/Guides";
import SurveySelect from "./pages/SurveySelect";
import SessionActive from "./pages/SessionActive";
import SessionReview from "./pages/SessionReview";
import SessionConditions from "./pages/SessionConditions";



export default function App() {
  return (
    <Router>
      <Routes>
        {/* App opens up on login/reg*/}
        <Route path="/" element={<Auth />} />
        <Route path="/onboarding" element={<SurveySitesOnBoarding />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/guides" element={<Guides />} />
        <Route path="/survey-select" element={<SurveySelect />} />
        <Route path="/session-active" element={<SessionActive />} />
        <Route path="/session-review" element={<SessionReview />} />
        <Route path="/session-conditions" element={<SessionConditions />} />
      </Routes>
    </Router>
  );
}

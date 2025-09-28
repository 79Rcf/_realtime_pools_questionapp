import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage/Home";
import JoinSession from "./pages/JoinSessionPage/JoinSession";
import HostDashboard from "./pages/HostDashboardPage/HostDashboard";
import ParticipantSession from "./components/ParticipantSession";
import TestFlow from "./test/test";
import TestPoll from "./test/pollanswer";

const App = () => {
  return (
      <Router>
        <Routes>
        <Route path="/test-poll" element={<TestPoll />} />
        <Route path="/test" element={<TestFlow />} />
          <Route path="/" element={<Home />} />
          <Route path="/join" element={<JoinSession />} />
          <Route path="/dashboard" element={<HostDashboard />} />
          <Route path="/participant" element={<ParticipantSession/>} />
        </Routes>
      </Router>
  );
};

export default App;

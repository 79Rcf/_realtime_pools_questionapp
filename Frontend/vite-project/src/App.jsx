import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/HomePage/Home";
import JoinSession from "./pages/JoinSessionPage/JoinSession";
import HostDashboard from "./pages/HostDashboardPage/HostDashboard";
import SignUp from "./pages/SignUpPage/Signup";
import SignIn from "./pages/SignUpPage/Signin";
import Session from "./pages/Sessions/Session";


const App = () => {
  return (
    <Router>
      <Routes>
       
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/session" element={<Session />} />
        

        <Route path="/" element={<Home />} />
        <Route path="/join/:code" element={<JoinSession />} />
        <Route path="/dashboard" element={<HostDashboard />} />

      </Routes>
    </Router>
  );
};

export default App;

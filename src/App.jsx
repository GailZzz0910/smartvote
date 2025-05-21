import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Login from "./Auth/Login";
import Home from "./Home";
import AddCandidate from "./screen/AddCandidate";
import GetBarangay from "./screen/GetBarangay";
import Profile from "./screen/Profile";
import VotersMonitoring from "./screen/VotersMonitoring,";

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState("");

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Login setIsLoggedIn={setIsLoggedIn} setAuthToken={setAuthToken} />
          }
        />
        <Route
          path="/home"
          element={
            <Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          }
        />
        <Route
          path="/add-candidate"
          element={<AddCandidate setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/get-barangay"
          element={<GetBarangay setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route 
          path="/profile" 
          element={<Profile />} 
        />
        <Route 
          path="/voters-monitoring" 
          element={<VotersMonitoring />} 
        />

      </Routes>
    </Router>
  );
}

export default App;

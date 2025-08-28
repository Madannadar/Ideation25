import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PhoneLogin from "./component/PhoneLogin";
import PatientForm from "./pages/PatientForm";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load user + token from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedToken) setToken(storedToken);
  }, []);

  const handleAuth = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            !user ? (
              <>
                <Login onAuth={(u) => handleAuth(u, localStorage.getItem("token"))} />
                <PhoneLogin onAuth={(u) => handleAuth(u, localStorage.getItem("token"))} />
              </>
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !user ? (
              <Signup onAuth={(u) => handleAuth(u, localStorage.getItem("token"))} />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        {/* Private Routes */}
        <Route
          path="/dashboard"
          element={
            user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/patient-form"
          element={
            user ? <PatientForm user={user} token={token} /> : <Navigate to="/login" />
          }
        />

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;

import { useState } from "react";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PhoneLogin from "./component/PhoneLogin";

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login");

  const handleAuth = (userData) => {
    // Save user in state
    setUser(userData);

    // Save in localStorage (so login persists after refresh)
    localStorage.setItem("user", JSON.stringify(userData));

    setPage("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setPage("login");
  };

  return (
    <div>
      {!user && (
        <>
          <button onClick={() => setPage("login")}>Login</button>
          <button onClick={() => setPage("signup")}>Signup</button>
        </>
      )}

      {page === "login" && (
        <>
          <Login onAuth={handleAuth} />
          <PhoneLogin onAuth={handleAuth} />
        </>
      )}

      {page === "signup" && <Signup onAuth={handleAuth} />}
      {page === "dashboard" && <Dashboard user={user} onLogout={handleLogout} />}
    </div>
  );
}

export default App;

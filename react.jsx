import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // user or admin
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/login", { username, email, password });
      const token = res.data.excessToken;
      localStorage.setItem("token", token);
      const payload = JSON.parse(atob(token.split(".")[1]));
      setRole(payload.role);
      setLoggedIn(true);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  if (!loggedIn) {
    return (
      <form onSubmit={handleLogin} style={{ maxWidth: 400, margin: "50px auto" }}>
        <h2>Login</h2>
        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button>Login</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome, {username}</h1>
      {role === "admin" && <p>This is the Admin Section</p>}
      {role === "user" && <p>This is the User Section</p>}
      <button onClick={() => { localStorage.removeItem("token"); setLoggedIn(false); setRole(""); }}>Logout</button>
    </div>
  );
};

export default App;

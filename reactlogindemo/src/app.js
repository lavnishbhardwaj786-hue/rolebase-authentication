import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

/* ================= LOGIN PAGE ================= */
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple role-based login
    if (formData.username === "admin" && formData.password === "admin123") {
      navigate("/admin");
    } else if (formData.username === "user" && formData.password === "user123") {
      navigate("/user");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          required
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

/* ================= USER PAGE ================= */
const UserPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h2>User Dashboard</h2>
      <p>Welcome User 👤</p>
      <button onClick={() => navigate("/")}>Logout</button>
    </div>
  );
};

/* ================= ADMIN PAGE ================= */
const AdminPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <p>Welcome Admin 👑</p>
      <button onClick={() => navigate("/")}>Logout</button>
    </div>
  );
};

/* ================= MAIN APP ================= */
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
};

export default App;

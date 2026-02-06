import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import "./styles.css";

// ---------- Protected Route ----------
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/" />;
  if (role && role !== userRole) return <Navigate to="/" />;

  return children;
};

// ---------- Register Component ----------
const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      alert("Password too weak. Minimum 6 characters.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      console.log("Register response:", res.data);
      if (res.data.success) {
        alert("Registered successfully. Please login.");
        navigate("/");
      } else {
        alert(res.data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" onChange={handleChange} required />
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account?{" "}
        <span style={{ color: "blue", cursor: "pointer" }} onClick={() => navigate("/")}>
          Login
        </span>
      </p>
    </div>
  );
};

// ---------- Login Component ----------
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/loginuser", formData);
      console.log("Login response:", res.data);

      if (res.data.success) {
        // normalize role to prevent unknown role issue
        const role = res.data.role?.trim() || "user";
        localStorage.setItem("token", res.data.excessToken);
        localStorage.setItem("role", role);

        if (role === "admin") navigate("/admin");
        else if (role === "user") navigate("/user");
        else alert("Unknown role: " + role);
      } else {
        alert(res.data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account?{" "}
        <span style={{ color: "blue", cursor: "pointer" }} onClick={() => navigate("/register")}>
          Register
        </span>
      </p>
    </div>
  );
};

// ---------- User Dashboard ----------
const UserPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/home/welcome", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
        alert("Session expired. Please login again.");
        localStorage.clear();
        navigate("/");
      }
    };
    fetchData();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="container">
      <h2>User Dashboard</h2>
      {user && (
        <div>
          <p>Username: {user.username}</p>
          <p>Role: {user.role}</p>
        </div>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

// ---------- Admin Dashboard ----------
const AdminPage = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/welcome", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmin(res.data);
      } catch (err) {
        console.error(err);
        alert("Session expired. Please login again.");
        localStorage.clear();
        navigate("/");
      }
    };
    fetchData();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      {admin && <p>{admin.message}</p>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

// ---------- Main App ----------
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute role="user">
              <UserPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

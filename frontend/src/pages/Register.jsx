import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      setError("Please fill all details");
      return;
    }
    try {
      setLoading(true);
      setError("");
     const res =  await axios.post(
        "http://localhost:3000/api/auth/register",
        { username, email, password },
        { withCredentials: true },
      );
      console.log(res.data);
      console.log(res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return(
  <div className="register-container">
    {/* left-side */}
    <div className="register-left">
      <div className="register-left-content">
        <div className="register-logo">🎓</div>
        <h1 className="register-college-title">CampusVoice</h1>
        <p className="register-tagline">Joined thousands of students</p>
        <div className="register-features">
          <div className="register-feature-item">📝 Register in seconds</div>
          <div className="register-feature-item"> 🎯 Track your complaints</div>
          <div className="register-feature-item"> 🔔 Get instant updates</div>
          <div className="register-feature-item"> 🏫 Made for students</div>
        </div>
      </div>
    </div>
    {/* right side */}
    <div className="register-right">
      <div className="register-card">
        <h2 className="register-title">Create Account</h2>
        <p className="register-subtitle">Join CampuseVoice today</p>
        {error && <div className="register-error">{error}</div>}
        <div className="register-input-group">
          <label className="register-label">Username</label>
          <input
            className="register-input"
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="register-input-group">
          <label className="register-label">Email</label>
          <input
            className="register-input"
            type="email"
            placeholder="yourcollege.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="register-input-group">
          <label className="register-label">Password</label>
          <input
            className="register-input"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="register-button"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Creating account" : "Create account"}
        </button>
        <p className="register-switch-text">
          Already have an account? {""}
          <Link to = "/" className="register-link"> Login here</Link>
        </p>
      </div>
    </div>
  </div>
  )
};

export default Register;

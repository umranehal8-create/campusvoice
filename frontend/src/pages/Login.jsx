import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios'
import './Login.css'


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleLogin() {
    if (!email || !password) {
      setError("please fill in all details");
    }

    try {
      setError("");
      setLoading(true);

      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password },
        { withCredentials: true },
      );

      const user = res.data.user;
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-left-content">
          <div className="login-logo">👩‍🎓🎓</div>
          <h1 className="login-college-title">CampusVoice</h1>
          <p className="login-tagline">Your complaints, Our priority</p>
          <div className="login-features">
            <div className="login-feature-item">
              {" "}
              ✅ Submit complaints instantly
            </div>
            <div className="login-feature-item">
              {" "}
              📊 Track resolution status
            </div>
            <div className="login-feature-item">
              {" "}
              🔒 Secure and confidential
            </div>
            <div className="login-feature-item">
              {" "}
              ✨ Fast response guaranteed
            </div>
          </div>
        </div>
      </div>
      <div className="login-right">
        <div className="login-card">
          <h2 className="login-title">Welcome Back 👏</h2>
          <p className="login-subtitle">Login to your CampusVoice account</p>
          {error && <div className="login-error">{error}</div>}
          <div className="login-input-group">
            <label className="login-label">Email address</label>
            <input
              className="login-input"
              type="email"
              placeholder="your@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="login-input-group">
            <label className="login-label">Password</label>
            <input
              className="login-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="login-button"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "logging in..." : "Login->"}
          </button>
          <p className="login-switch-text">
            Dont have an account ? {""}
            <Link to="/register" className="login-link">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

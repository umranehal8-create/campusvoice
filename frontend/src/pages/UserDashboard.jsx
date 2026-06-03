import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserDashboard.css";

const UserDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    category: "other",
  });
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  async function fetchMyComplaints() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/complaint/get-my-complaints`,
        { withCredentials: true },
      );
      setComplaints(res.data.myComplaints || []);
    } catch (err) {
      navigate("/");
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (!formData.title || !formData.description || !formData.location) {
      setError("Please fill all required fields");
      return;
    }
    try {
      setError("");
      setSuccess("");
      setSubmitting(true);
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("location", formData.location);
      data.append("category", formData.category);
      if (image) data.append("image", image);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/complaint/create-complaint`,
        data,
        { withCredentials: true },
      );

      setSuccess("Complaint submitted successfully!");
      setFormData({
        title: "",
        description: "",
        location: "",
        category: "other",
      });
      setImage(null);
      fetchMyComplaints();
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("user");
    navigate("/");
  }

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "pending").length;
  const inProgress = complaints.filter(
    (c) => c.status === "in-progress",
  ).length;
  const resolved = complaints.filter((c) => c.status === "resolved").length;

  return (
    <div className="ud-container">
      {/* NAVBAR */}
      <div className="ud-navbar">
        <div className="ud-brand">🎓 CampusVoice</div>
        <div className="ud-nav-right">
          <span className="ud-username">👋 {user?.username}</span>
          <button className="ud-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="ud-main">
        {/* STATS */}
        <div className="ud-stats">
          <div className="ud-stat-card ud-stat-total">
            <div className="ud-stat-number">{total}</div>
            <div className="ud-stat-label">Total</div>
          </div>
          <div className="ud-stat-card ud-stat-pending">
            <div className="ud-stat-number">{pending}</div>
            <div className="ud-stat-label">Pending</div>
          </div>
          <div className="ud-stat-card ud-stat-progress">
            <div className="ud-stat-number">{inProgress}</div>
            <div className="ud-stat-label">In Progress</div>
          </div>
          <div className="ud-stat-card ud-stat-resolved">
            <div className="ud-stat-number">{resolved}</div>
            <div className="ud-stat-label">Resolved</div>
          </div>
        </div>

        <div className="ud-content">
          {/* FORM */}
          <div className="ud-form-section">
            <h2 className="ud-section-title">Submit a Complaint</h2>
            {error && <div className="ud-error">{error}</div>}
            {success && <div className="ud-success">{success}</div>}

            <div className="ud-input-group">
              <label className="ud-label">Title *</label>
              <input
                className="ud-input"
                placeholder="Brief title of your complaint"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div className="ud-input-group">
              <label className="ud-label">Description *</label>
              <textarea
                className="ud-textarea"
                placeholder="Describe your complaint in detail..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="ud-input-group">
              <label className="ud-label">Location *</label>
              <input
                className="ud-input"
                placeholder="e.g. Block A, Room 204"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
            <div className="ud-input-group">
              <label className="ud-label">Category</label>
              <select
                className="ud-select"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="internet">Internet</option>
                <option value="cleaning">Cleaning</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="ud-input-group">
              <label className="ud-label">Image (optional)</label>
              <input
                className="ud-file-input"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <button
              className="ud-submit-btn"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>

          {/* COMPLAINTS LIST */}
          <div className="ud-list-section">
            <h2 className="ud-section-title">My Complaints</h2>
            {loading ? (
              <p className="ud-loading">Loading...</p>
            ) : complaints.length === 0 ? (
              <p className="ud-empty">No complaints submitted yet.</p>
            ) : (
              <div className="ud-cards">
                {complaints.map((c) => (
                  <div className="ud-card" key={c._id}>
                    <div className="ud-card-top">
                      <span className="ud-card-title">{c.title}</span>
                      <span className={`ud-badge ud-badge-${c.status}`}>
                        {c.status}
                      </span>
                    </div>
                    <p className="ud-card-desc">{c.description}</p>
                    <div className="ud-card-meta">
                      <span>📍 {c.location}</span>
                      <span>🏷️ {c.category}</span>
                    </div>
                    {c.image && (
                      <img
                        className="ud-card-img"
                        src={c.image}
                        alt="complaint"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

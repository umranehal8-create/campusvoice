import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchAllComplaints();
  }, []);

  async function fetchAllComplaints() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/complaint/get-all-complaints`,
        { withCredentials: true },
      );
      setComplaints(res.data.allComplaints || []);
    } catch (err) {
      navigate("/");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id, status) {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/complaint/updated-status/${id}`,
        { status },
        { withCredentials: true },
      );
      fetchAllComplaints();
    } catch (err) {
      alert("Status update failed");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this complaint?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/complaint/delete-complaint/${id}`,
        { withCredentials: true },
      );
      fetchAllComplaints();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  }

  function handleLogout() {
    localStorage.removeItem("user");
    navigate("/");
  }

  const filtered =
    filter === "all"
      ? complaints
      : complaints.filter((c) => c.status === filter);

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "pending").length;
  const inProgress = complaints.filter(
    (c) => c.status === "in-progress",
  ).length;
  const resolved = complaints.filter((c) => c.status === "resolved").length;

  return (
    <div className="ad-container">
      {/* NAVBAR */}
      <div className="ad-navbar">
        <div className="ad-brand">
          🎓 CampusVoice <span className="ad-admin-tag">Admin</span>
        </div>
        <div className="ad-nav-right">
          <span className="ad-username">👋 {user?.username}</span>
          <button className="ad-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="ad-main">
        {/* STATS */}
        <div className="ad-stats">
          <div className="ad-stat-card ad-stat-total">
            <div className="ad-stat-number">{total}</div>
            <div className="ad-stat-label">Total</div>
          </div>
          <div className="ad-stat-card ad-stat-pending">
            <div className="ad-stat-number">{pending}</div>
            <div className="ad-stat-label">Pending</div>
          </div>
          <div className="ad-stat-card ad-stat-progress">
            <div className="ad-stat-number">{inProgress}</div>
            <div className="ad-stat-label">In Progress</div>
          </div>
          <div className="ad-stat-card ad-stat-resolved">
            <div className="ad-stat-number">{resolved}</div>
            <div className="ad-stat-label">Resolved</div>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="ad-table-section">
          <div className="ad-table-header">
            <h2 className="ad-section-title">All Complaints</h2>
            <div className="ad-filters">
              {["all", "pending", "in-progress", "resolved"].map((f) => (
                <button
                  key={f}
                  className={`ad-filter-btn ${filter === f ? "active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="ad-loading">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="ad-empty">No complaints found.</p>
          ) : (
            <div className="ad-table-wrapper">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Location</th>
                    <th>Category</th>
                    <th>Student</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c._id}>
                      <td className="ad-td-title">{c.title}</td>
                      <td className="ad-td-desc">{c.description}</td>
                      <td>📍 {c.location}</td>
                      <td>🏷️ {c.category}</td>
                      <td>👤 {c.createdBy?.username || "N/A"}</td>
                      <td>
                        <select
                          className={`ad-status-select ad-status-${c.status}`}
                          value={c.status}
                          onChange={(e) =>
                            handleStatusChange(c._id, e.target.value)
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </td>
                      <td>
                        {c.status === "resolved" && (
                          <button
                            className="ad-delete-btn"
                            onClick={() => handleDelete(c._id)}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

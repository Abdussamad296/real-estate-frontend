import { useEffect, useState } from "react";
import api from "../../services/api";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [agents, setAgents] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [agentsRes, propertiesRes] = await Promise.all([
        api.get("/agents/applications"),
        api.get("/property/admin/pending"),
      ]);

      setAgents(agentsRes.data.data || []);
      setProperties(propertiesRes.data.data || []);
    } catch (err) {
      console.error(err);

      setError(err.response?.data?.message || "Failed to load admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Agent Approve / Reject
  const updateAgentStatus = async (agentId, status) => {
    try {
      await api.patch(`/agents/applications/${agentId}/status`, { status });

      setAgents((prev) => prev.filter((agent) => agent._id !== agentId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update agent");
    }
  };

  // Property Approve / Reject
  const updatePropertyStatus = async (propertyId, status) => {
    try {
      const endpoint =
        status === "approved"
          ? `/property/admin/${propertyId}/approve`
          : `/property/admin/${propertyId}/reject`;

      await api.patch(endpoint);

      setProperties((prev) =>
        prev.filter((property) => property._id !== propertyId),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update property");
    }
  };

  if (loading) {
    return (
      <main className="admin-dashboard">
        <div className="admin-message">Loading dashboard...</div>
      </main>
    );
  }

  return (
    <main className="admin-dashboard">
      {/* HEADER */}
      <section className="admin-header">
        <span>ADMIN DASHBOARD</span>

        <h1>Dashboard Overview</h1>

        <p>Manage agent applications and property approvals from one place.</p>
      </section>

      {error && <div className="admin-error">{error}</div>}

      {/* STATS */}
      <section className="admin-stats">
        <div className="admin-stat">
          <span>Pending Agents</span>
          <strong>{agents.length}</strong>
        </div>

        <div className="admin-stat">
          <span>Pending Properties</span>
          <strong>{properties.length}</strong>
        </div>

        <div className="admin-stat">
          <span>Total Pending</span>
          <strong>{agents.length + properties.length}</strong>
        </div>
      </section>

      {/* AGENT APPLICATIONS */}
      <section className="admin-section">
        <div className="admin-section-header">
          <div>
            <span>AGENT MANAGEMENT</span>
            <h2>Pending Agent Applications</h2>
          </div>
        </div>

        {agents.length === 0 ? (
          <div className="admin-message">No pending agent applications.</div>
        ) : (
          <div className="admin-list">
            {agents.map((agent) => (
              <article className="admin-list-item" key={agent._id}>
                <div className="admin-item-info">
                  <h3>{agent.user?.name || "Agent"}</h3>

                  <p>{agent.user?.email || "No email"}</p>

                  <small>Agency: {agent.agencyName || "Not provided"}</small>

                  {agent.experience !== undefined && (
                    <small>Experience: {agent.experience} years</small>
                  )}
                </div>

                <div className="admin-actions">
                  <button
                    className="approve-btn"
                    onClick={() => updateAgentStatus(agent._id, "approved")}
                  >
                    Approve
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() => updateAgentStatus(agent._id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* PROPERTY APPROVAL */}
      <section className="admin-section">
        <div className="admin-section-header">
          <div>
            <span>PROPERTY MANAGEMENT</span>
            <h2>Pending Properties</h2>
          </div>
        </div>

        {properties.length === 0 ? (
          <div className="admin-message">No pending properties.</div>
        ) : (
          <div className="admin-property-grid">
            {properties.map((property) => (
              <article className="admin-property-card" key={property._id}>
                <div className="admin-property-image">
                  <img
                    src={property.images?.[0] || "/placeholder-property.jpg"}
                    alt={property.title}
                  />

                  <span>{property.purpose}</span>
                </div>

                <div className="admin-property-content">
                  <h3>{property.title}</h3>

                  <p>
                    {property.location?.city}, {property.location?.state}
                  </p>

                  <strong>₹{property.price?.toLocaleString("en-IN")}</strong>

                  <small>
                    Agent:{" "}
                    {property.agent?.name || property.agent?.email || "Unknown"}
                  </small>

                  <div className="property-actions">
                    <button
                      className="approve-btn"
                      onClick={() =>
                        updatePropertyStatus(property._id, "approved")
                      }
                    >
                      Approve
                    </button>

                    <button
                      className="reject-btn"
                      onClick={() =>
                        updatePropertyStatus(property._id, "rejected")
                      }
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default AdminDashboard;

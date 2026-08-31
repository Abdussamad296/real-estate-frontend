import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./AgentDashboard.css";

const AgentDashboard = () => {
    const navigate = useNavigate();

    const [properties, setProperties] = useState([]);
    const [enquiries, setEnquiries] = useState([]);
    const [visits, setVisits] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError("");

            const [propertiesRes, enquiriesRes, visitsRes] =
                await Promise.all([
                    api.get("/property/my-properties"),
                    api.get("/enquery/my-enquiries"),
                    api.get("/visits/agent-visits")
                ]);

            setProperties(propertiesRes.data.data || []);
            setEnquiries(enquiriesRes.data.data || []);
            setVisits(visitsRes.data.data || []);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load dashboard"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const updateEnquiryStatus = async (enquiryId, status) => {
        try {
            await api.patch(
                `/enquery/${enquiryId}/status`,
                { status }
            );

            setEnquiries((prev) =>
                prev.map((enquiry) =>
                    enquiry._id === enquiryId
                        ? { ...enquiry, status }
                        : enquiry
                )
            );

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to update enquiry"
            );
        }
    };

    const updateVisitStatus = async (visitId, status) => {
        try {
            await api.patch(
                `/visits/${visitId}/status`,
                { status }
            );

            setVisits((prev) =>
                prev.map((visit) =>
                    visit._id === visitId
                        ? { ...visit, status }
                        : visit
                )
            );

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to update visit"
            );
        }
    };

    if (loading) {
        return (
            <main className="agent-dashboard">
                <p className="dashboard-message">
                    Loading dashboard...
                </p>
            </main>
        );
    }

    return (
        <main className="agent-dashboard">

            {/* HEADER */}
            <section className="agent-header">
                <span className="dashboard-eyebrow">
                    AGENT DASHBOARD
                </span>

                <h1>Welcome back, Agent</h1>

                <p>
                    Manage your properties, enquiries and visit
                    requests from one place.
                </p>
            </section>

            {error && (
                <div className="dashboard-error">
                    {error}
                </div>
            )}

            {/* STATS */}
            <section className="agent-stats">

                <div className="agent-stat-card">
                    <span>My Properties</span>
                    <strong>{properties.length}</strong>
                </div>

                <div className="agent-stat-card">
                    <span>Enquiries</span>
                    <strong>{enquiries.length}</strong>
                </div>

                <div className="agent-stat-card">
                    <span>Visit Requests</span>
                    <strong>{visits.length}</strong>
                </div>

                <div className="agent-stat-card">
                    <span>Pending Visits</span>
                    <strong>
                        {
                            visits.filter(
                                (visit) =>
                                    visit.status === "pending"
                            ).length
                        }
                    </strong>
                </div>

            </section>

            {/* MY PROPERTIES */}
            <section className="agent-section">

                <div className="section-header">
                    <div>
                        <span className="section-eyebrow">
                            LISTINGS
                        </span>

                        <h2>My Properties</h2>
                    </div>

                    <button
                        className="primary-btn"
                        onClick={() =>
                            navigate("/agent/properties/create")
                        }
                    >
                        + Add Property
                    </button>
                </div>

                {properties.length === 0 ? (
                    <div className="dashboard-message">
                        No properties found.
                    </div>
                ) : (
                    <div className="agent-property-grid">

                        {properties.map((property) => (
                            <article
                                className="agent-property-card"
                                key={property._id}
                            >

                                <div className="agent-property-image">

                                    <img
                                        src={
                                            property.images?.[0] ||
                                            "/placeholder-property.jpg"
                                        }
                                        alt={property.title}
                                    />

                                    <span>
                                        {property.status ||
                                            "active"}
                                    </span>

                                </div>

                                <div className="agent-property-content">

                                    <h3>{property.title}</h3>

                                    <p>
                                        {property.location?.city},{" "}
                                        {property.location?.state}
                                    </p>

                                    <strong>
                                        ₹
                                        {property.price?.toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>

                                    <button
                                        className="secondary-btn"
                                        onClick={() =>
                                            navigate(
                                                `/properties/${property._id}`
                                            )
                                        }
                                    >
                                        View Property
                                    </button>

                                </div>

                            </article>
                        ))}

                    </div>
                )}

            </section>

            {/* ENQUIRIES */}
            <section className="agent-section">

                <div className="section-header">
                    <div>
                        <span className="section-eyebrow">
                            LEADS
                        </span>

                        <h2>Recent Enquiries</h2>
                    </div>
                </div>

                {enquiries.length === 0 ? (
                    <div className="dashboard-message">
                        No enquiries found.
                    </div>
                ) : (
                    <div className="agent-list">

                        {enquiries.map((enquiry) => (
                            <div
                                className="agent-list-item"
                                key={enquiry._id}
                            >

                                <div className="item-info">

                                    <h3>
                                        {enquiry.user?.name ||
                                            "User"}
                                    </h3>

                                    <p>
                                        {enquiry.property?.title ||
                                            "Property"}
                                    </p>

                                    {enquiry.message && (
                                        <small>
                                            {enquiry.message}
                                        </small>
                                    )}

                                </div>

                                <div className="item-actions">

                                    <span
                                        className={`status ${enquiry.status}`}
                                    >
                                        {enquiry.status}
                                    </span>

                                    {enquiry.status ===
                                        "pending" && (
                                        <>
                                            <button
                                                className="approve-btn"
                                                onClick={() =>
                                                    updateEnquiryStatus(
                                                        enquiry._id,
                                                        "contacted"
                                                    )
                                                }
                                            >
                                                Contacted
                                            </button>

                                            <button
                                                className="reject-btn"
                                                onClick={() =>
                                                    updateEnquiryStatus(
                                                        enquiry._id,
                                                        "closed"
                                                    )
                                                }
                                            >
                                                Close
                                            </button>
                                        </>
                                    )}

                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </section>

            {/* VISITS */}
            <section className="agent-section">

                <div className="section-header">
                    <div>
                        <span className="section-eyebrow">
                            APPOINTMENTS
                        </span>

                        <h2>Visit Requests</h2>
                    </div>
                </div>

                {visits.length === 0 ? (
                    <div className="dashboard-message">
                        No visit requests found.
                    </div>
                ) : (
                    <div className="agent-list">

                        {visits.map((visit) => (
                            <div
                                className="agent-list-item"
                                key={visit._id}
                            >

                                <div className="item-info">

                                    <h3>
                                        {visit.user?.name ||
                                            "User"}
                                    </h3>

                                    <p>
                                        {visit.property?.title ||
                                            "Property"}
                                    </p>

                                    <small>
                                        {visit.visitDate
                                            ? new Date(
                                                  visit.visitDate
                                              ).toLocaleString(
                                                  "en-IN"
                                              )
                                            : "Date not available"}
                                    </small>

                                </div>

                                <div className="item-actions">

                                    <span
                                        className={`status ${visit.status}`}
                                    >
                                        {visit.status}
                                    </span>

                                    {visit.status ===
                                        "pending" && (
                                        <>
                                            <button
                                                className="approve-btn"
                                                onClick={() =>
                                                    updateVisitStatus(
                                                        visit._id,
                                                        "approved"
                                                    )
                                                }
                                            >
                                                Approve
                                            </button>

                                            <button
                                                className="reject-btn"
                                                onClick={() =>
                                                    updateVisitStatus(
                                                        visit._id,
                                                        "rejected"
                                                    )
                                                }
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}

                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </section>

        </main>
    );
};

export default AgentDashboard;


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./UserDashboard.css";

const UserDashboard = () => {
    const navigate = useNavigate();

    const [savedProperties, setSavedProperties] = useState([]);
    const [enquiries, setEnquiries] = useState([]);
    const [visits, setVisits] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancellingVisitId, setCancellingVisitId] =
        useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                savedResponse,
                enquiryResponse,
                visitResponse
            ] = await Promise.all([
                api.get("/savedproperty/saved"),
                api.get("/enquiry/my"),
                api.get("/visits/my-visits")
            ]);

            setSavedProperties(
                savedResponse.data.data || []
            );

            setEnquiries(
                enquiryResponse.data.data || []
            );

            setVisits(
                visitResponse.data.data || []
            );

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


    // Cancel Visit
    const handleCancelVisit = async (visitId) => {
        try {
            setCancellingVisitId(visitId);

            const response = await api.patch(
                `/visits/${visitId}/cancel`
            );

            const updatedVisit =
                response.data.data;

            setVisits((prev) =>
                prev.map((visit) =>
                    visit._id === visitId
                        ? {
                            ...visit,
                            status:
                                updatedVisit?.status ||
                                "cancelled"
                        }
                        : visit
                )
            );

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to cancel visit"
            );

        } finally {
            setCancellingVisitId(null);
        }
    };


    const formatVisitDate = (date) => {
        if (!date) {
            return "Date not available";
        }

        return new Date(date).toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );
    };


    if (loading) {
        return (
            <main className="user-dashboard">
                <p className="dashboard-message">
                    Loading dashboard...
                </p>
            </main>
        );
    }


    return (
        <main className="user-dashboard">


            {/* HEADER */}

            <section className="dashboard-header">

                <div>

                    <span className="dashboard-eyebrow">
                        USER DASHBOARD
                    </span>

                    <h1>
                        Welcome back
                    </h1>

                    <p>
                        Manage your saved properties,
                        enquiries and visits.
                    </p>

                </div>

            </section>


            {/* ERROR */}

            {error && (
                <div className="dashboard-error">
                    {error}
                </div>
            )}


            {/* STATS */}

            <section className="dashboard-stats">


                <div className="stat-card">

                    <span>
                        Saved Properties
                    </span>

                    <strong>
                        {savedProperties.length}
                    </strong>

                </div>


                <div className="stat-card">

                    <span>
                        Enquiries
                    </span>

                    <strong>
                        {enquiries.length}
                    </strong>

                </div>


                <div className="stat-card">

                    <span>
                        Visits
                    </span>

                    <strong>
                        {visits.length}
                    </strong>

                </div>


            </section>


            {/* SAVED PROPERTIES */}

            <section className="dashboard-section">


                <div className="section-header">

                    <div>

                        <span className="section-eyebrow">
                            SAVED
                        </span>

                        <h2>
                            Saved Properties
                        </h2>

                    </div>

                </div>


                {savedProperties.length === 0 ? (

                    <p className="empty-message">
                        You haven't saved any properties yet.
                    </p>

                ) : (

                    <div className="dashboard-grid">

                        {savedProperties.map((item) => {

                            const property =
                                item.property || item;

                            if (!property) {
                                return null;
                            }

                            return (

                                <article
                                    className="dashboard-property-card"
                                    key={item._id}
                                >


                                    <div className="dashboard-property-image">

                                        <img
                                            src={
                                                property.images?.[0] ||
                                                "/placeholder-property.jpg"
                                            }
                                            alt={property.title}
                                        />

                                        <span>
                                            {property.purpose}
                                        </span>

                                    </div>


                                    <div className="dashboard-property-content">

                                        <h3>
                                            {property.title}
                                        </h3>


                                        <p>

                                            {property.location?.city}
                                            {property.location?.city &&
                                                property.location?.state &&
                                                ", "
                                            }
                                            {property.location?.state}

                                        </p>


                                        <strong>

                                            ₹
                                            {property.price?.toLocaleString(
                                                "en-IN"
                                            )}

                                        </strong>


                                        <button
                                            className="view-property-btn"
                                            onClick={() =>
                                                navigate(
                                                    `/properties/${property._id}`
                                                )
                                            }
                                        >

                                            View Details

                                        </button>

                                    </div>


                                </article>
                            );
                        })}

                    </div>
                )}

            </section>


            {/* ENQUIRIES */}

            <section className="dashboard-section">


                <div className="section-header">

                    <div>

                        <span className="section-eyebrow">
                            CONTACT
                        </span>

                        <h2>
                            My Enquiries
                        </h2>

                    </div>

                </div>


                {enquiries.length === 0 ? (

                    <p className="empty-message">
                        No enquiries yet.
                    </p>

                ) : (

                    <div className="dashboard-list">

                        {enquiries.map((enquiry) => (

                            <div
                                className="dashboard-list-item"
                                key={enquiry._id}
                            >


                                <div>

                                    <h3>

                                        {enquiry.property?.title ||
                                            "Property"}

                                    </h3>


                                    <p>
                                        {enquiry.message}
                                    </p>

                                </div>


                                <span
                                    className={`status ${
                                        enquiry.status || "new"
                                    }`}
                                >

                                    {enquiry.status || "new"}

                                </span>


                            </div>
                        ))}

                    </div>
                )}

            </section>


            {/* MY VISITS */}

            <section className="dashboard-section">


                <div className="section-header">

                    <div>

                        <span className="section-eyebrow">
                            SCHEDULED
                        </span>

                        <h2>
                            My Visits
                        </h2>

                    </div>

                </div>


                {visits.length === 0 ? (

                    <p className="empty-message">
                        No property visits scheduled.
                    </p>

                ) : (

                    <div className="dashboard-list">

                        {visits.map((visit) => (

                            <div
                                className="dashboard-list-item"
                                key={visit._id}
                            >


                                {/* VISIT INFO */}

                                <div>

                                    <h3>

                                        {visit.property?.title ||
                                            "Property Visit"}

                                    </h3>


                                    <p>

                                        <strong>
                                            Visit Date:
                                        </strong>{" "}

                                        {formatVisitDate(
                                            visit.visitDate
                                        )}

                                    </p>


                                    {visit.agent && (

                                        <p>

                                            <strong>
                                                Agent:
                                            </strong>{" "}

                                            {visit.agent.name ||
                                                "Property Agent"}

                                        </p>

                                    )}


                                    {visit.message && (

                                        <p>

                                            <strong>
                                                Message:
                                            </strong>{" "}

                                            {visit.message}

                                        </p>

                                    )}

                                </div>


                                {/* VISIT ACTIONS */}

                                <div className="visit-actions">


                                    <span
                                        className={`status ${
                                            visit.status
                                        }`}
                                    >

                                        {visit.status}

                                    </span>


                                    {(visit.status === "pending" ||
                                        visit.status === "approved") && (

                                        <button
                                            className="cancel-visit-btn"
                                            onClick={() =>
                                                handleCancelVisit(
                                                    visit._id
                                                )
                                            }
                                            disabled={
                                                cancellingVisitId ===
                                                visit._id
                                            }
                                        >

                                            {cancellingVisitId ===
                                            visit._id
                                                ? "Cancelling..."
                                                : "Cancel"
                                            }

                                        </button>

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

export default UserDashboard;

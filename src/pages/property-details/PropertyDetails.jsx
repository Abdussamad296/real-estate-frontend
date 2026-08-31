import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import "./PropertyDetails.css";

const PropertyDetails = () => {
    const { propertyId } = useParams();

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    const fetchProperty = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(`/property/${propertyId}`);

            setProperty(response.data.data);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load property"
            );
        } finally {
            setLoading(false);
        }
    };

    // Check whether property is already saved
    const checkSavedProperty = async () => {
        try {
            const response = await api.get("/savedproperty/saved");

            const savedProperties = response.data.data || [];

            const isSaved = savedProperties.some(
                (item) =>
                    item.property?._id === propertyId ||
                    item.property === propertyId
            );

            setSaved(isSaved);
        } catch (error) {
            console.error("Failed to check saved property", error);
        }
    };

    useEffect(() => {
        fetchProperty();
        checkSavedProperty();
    }, [propertyId]);

    // Save / Unsave
    const handleSave = async () => {
        try {
            setSaving(true);

            if (saved) {
                await api.delete(
                    `/savedproperty/${propertyId}/save`
                );

                setSaved(false);
            } else {
                await api.post(
                    `/savedproperty/${propertyId}/save`
                );

                setSaved(true);
            }
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to update saved property"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <main className="property-details-page">
                <p>Loading property...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="property-details-page">
                <p className="property-error">{error}</p>
            </main>
        );
    }

    if (!property) {
        return (
            <main className="property-details-page">
                <p>Property not found.</p>
            </main>
        );
    }

    return (
        <main className="property-details-page">

            {/* IMAGES */}
            <section className="property-gallery">

                <img
                    src={
                        property.images?.[0] ||
                        "/placeholder-property.jpg"
                    }
                    alt={property.title}
                />

            </section>

            {/* PROPERTY INFO */}
            <section className="property-details-content">

                <div className="property-details-header">

                    <div>
                        <span className="property-purpose">
                            {property.purpose}
                        </span>

                        <h1>{property.title}</h1>

                        <p className="property-location">
                            {property.location?.city},{" "}
                            {property.location?.state}
                        </p>
                    </div>

                    {/* SAVE BUTTON */}
                    <button
                        className={`save-property-btn ${
                            saved ? "saved" : ""
                        }`}
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : saved
                                ? "♥ Saved"
                                : "♡ Save"}
                    </button>

                </div>

                {/* PRICE */}
                <div className="property-price">
                    ₹{property.price?.toLocaleString("en-IN")}
                </div>

                {/* DETAILS */}
                <div className="property-info-grid">

                    <div>
                        <span>Bedrooms</span>
                        <strong>
                            {property.bedrooms || 0}
                        </strong>
                    </div>

                    <div>
                        <span>Bathrooms</span>
                        <strong>
                            {property.bathrooms || 0}
                        </strong>
                    </div>

                    <div>
                        <span>Area</span>
                        <strong>
                            {property.area} sq.ft
                        </strong>
                    </div>

                    <div>
                        <span>Type</span>
                        <strong>
                            {property.propertyType}
                        </strong>
                    </div>

                </div>

                {/* DESCRIPTION */}
                <section className="property-description">

                    <h2>About this property</h2>

                    <p>
                        {property.description}
                    </p>

                </section>

                {/* LOCATION */}
                <section className="property-location-section">

                    <h2>Location</h2>

                    <p>
                        {property.location?.address}
                    </p>

                    <p>
                        {property.location?.city},{" "}
                        {property.location?.state}{" "}
                        {property.location?.pincode}
                    </p>

                </section>

                {/* AGENT */}
                <section className="property-agent">

                    <h2>Property Agent</h2>

                    <div className="agent-info">

                        <div>
                            <strong>
                                {property.agent?.name ||
                                    "Property Agent"}
                            </strong>

                            <p>
                                {property.agent?.email}
                            </p>

                            <p>
                                {property.agent?.phone}
                            </p>
                        </div>

                    </div>

                </section>

                {/* ACTIONS */}
                <div className="property-actions">

                    <button
                        className="enquiry-btn"
                        onClick={() =>
                            document
                                .getElementById("enquiry-form")
                                ?.scrollIntoView({
                                    behavior: "smooth"
                                })
                        }
                    >
                        Send Enquiry
                    </button>

                    <button
                        className="visit-btn"
                        onClick={() =>
                            document
                                .getElementById("visit-form")
                                ?.scrollIntoView({
                                    behavior: "smooth"
                                })
                        }
                    >
                        Schedule Visit
                    </button>

                </div>

            </section>

        </main>
    );
};

export default PropertyDetails;

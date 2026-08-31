import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import "./PropertyDetails.css";

const PropertyDetails = () => {
  const { propertyId } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Save Property
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Enquiry
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState("");
  const [enquiryError, setEnquiryError] = useState("");

  // Visit
  const [visitDate, setVisitDate] = useState("");
  const [visitMessage, setVisitMessage] = useState("");
  const [visitLoading, setVisitLoading] = useState(false);
  const [visitSuccess, setVisitSuccess] = useState("");
  const [visitError, setVisitError] = useState("");

  // Fetch Property
  const fetchProperty = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/property/${propertyId}`
      );

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


  // Check Saved Property
  const checkSavedProperty = async () => {
    try {
      const response = await api.get(
        "/savedproperty/saved"
      );

      const savedProperties =
        response.data.data || [];

      const isSaved = savedProperties.some(
        (item) =>
          item.property?._id === propertyId ||
          item.property === propertyId
      );

      setSaved(isSaved);

    } catch (error) {
      console.error(
        "Failed to check saved property",
        error
      );
    }
  };


  useEffect(() => {
    fetchProperty();
    checkSavedProperty();
  }, [propertyId]);


  // Save / Unsave Property
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


  // Send Enquiry
  const handleEnquirySubmit = async (e) => {
    e.preventDefault();

    try {
      setEnquiryLoading(true);
      setEnquiryError("");
      setEnquirySuccess("");

      if (!enquiryMessage.trim()) {
        setEnquiryError(
          "Please enter your enquiry message"
        );
        return;
      }

      const response = await api.post(
        `/enquiry/${propertyId}`,
        {
          message: enquiryMessage
        }
      );

      setEnquirySuccess(
        response.data.message ||
        "Enquiry sent successfully"
      );

      setEnquiryMessage("");

    } catch (error) {

      setEnquiryError(
        error.response?.data?.message ||
        "Failed to send enquiry"
      );

    } finally {
      setEnquiryLoading(false);
    }
  };


  // Schedule Visit
  const handleVisitSubmit = async (e) => {
    e.preventDefault();

    try {
      setVisitLoading(true);
      setVisitError("");
      setVisitSuccess("");

      if (!visitDate) {
        setVisitError(
          "Please select a visit date"
        );
        return;
      }

      const response = await api.post(
        `/visits/${propertyId}`,
        {
          visitDate,
          message: visitMessage
        }
      );

      setVisitSuccess(
        response.data.message ||
        "Visit request sent successfully"
      );

      setVisitDate("");
      setVisitMessage("");

    } catch (error) {

      setVisitError(
        error.response?.data?.message ||
        "Failed to schedule visit"
      );

    } finally {
      setVisitLoading(false);
    }
  };


  // Loading
  if (loading) {
    return (
      <main className="property-details-page">
        <p>Loading property...</p>
      </main>
    );
  }


  // Error
  if (error) {
    return (
      <main className="property-details-page">
        <p className="property-error">
          {error}
        </p>
      </main>
    );
  }


  // Property Not Found
  if (!property) {
    return (
      <main className="property-details-page">
        <p>Property not found.</p>
      </main>
    );
  }


  return (
    <main className="property-details-page">


      {/* PROPERTY IMAGE */}

      <section className="property-gallery">

        <img
          src={
            property.images?.[0] ||
            "/placeholder-property.jpg"
          }
          alt={property.title}
        />

      </section>


      {/* PROPERTY DETAILS */}

      <section className="property-details-content">


        {/* HEADER */}

        <div className="property-details-header">

          <div>

            <span className="property-purpose">
              {property.purpose}
            </span>

            <h1>
              {property.title}
            </h1>

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
                : "♡ Save"
            }

          </button>

        </div>


        {/* PRICE */}

        <div className="property-price">

          ₹
          {property.price?.toLocaleString(
            "en-IN"
          )}

        </div>


        {/* PROPERTY INFO */}

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

          <h2>
            About this property
          </h2>

          <p>
            {property.description}
          </p>

        </section>


        {/* LOCATION */}

        <section className="property-location-section">

          <h2>
            Location
          </h2>

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

          <h2>
            Property Agent
          </h2>

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


        {/* ACTION BUTTONS */}

        <div className="property-actions">


          <button
            className="enquiry-btn"
            onClick={() =>
              document
                .getElementById(
                  "enquiry-form"
                )
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
                .getElementById(
                  "visit-form"
                )
                ?.scrollIntoView({
                  behavior: "smooth"
                })
            }
          >

            Schedule Visit

          </button>


        </div>


        {/* ENQUIRY FORM */}

        <section
          className="property-form-section"
          id="enquiry-form"
        >

          <h2>
            Send Enquiry
          </h2>


          <p>
            Interested in this property?
            Send a message to the agent.
          </p>


          {enquirySuccess && (

            <div className="form-success">
              {enquirySuccess}
            </div>

          )}


          {enquiryError && (

            <div className="form-error">
              {enquiryError}
            </div>

          )}


          <form
            onSubmit={handleEnquirySubmit}
          >

            <textarea
              placeholder="Write your message..."
              value={enquiryMessage}
              onChange={(e) =>
                setEnquiryMessage(
                  e.target.value
                )
              }
              rows="5"
              required
            />


            <button
              type="submit"
              className="enquiry-btn"
              disabled={enquiryLoading}
            >

              {enquiryLoading
                ? "Sending..."
                : "Send Enquiry"
              }

            </button>

          </form>

        </section>


        {/* SCHEDULE VISIT FORM */}

        <section
          className="property-form-section"
          id="visit-form"
        >

          <h2>
            Schedule a Visit
          </h2>


          <p>
            Choose your preferred date and
            send a visit request to the agent.
          </p>


          {visitSuccess && (

            <div className="form-success">
              {visitSuccess}
            </div>

          )}


          {visitError && (

            <div className="form-error">
              {visitError}
            </div>

          )}


          <form
            onSubmit={handleVisitSubmit}
          >


            {/* VISIT DATE */}

            <div className="form-group">

              <label>
                Visit Date
              </label>


              <input
                type="datetime-local"
                value={visitDate}
                onChange={(e) =>
                  setVisitDate(
                    e.target.value
                  )
                }
                required
              />

            </div>


            {/* MESSAGE */}

            <div className="form-group">

              <label>
                Message (Optional)
              </label>


              <textarea
                placeholder={
                  "Add any message for the agent..."
                }
                value={visitMessage}
                onChange={(e) =>
                  setVisitMessage(
                    e.target.value
                  )
                }
                rows="4"
              />

            </div>


            <button
              type="submit"
              className="visit-btn"
              disabled={visitLoading}
            >

              {visitLoading
                ? "Sending Request..."
                : "Schedule Visit"
              }

            </button>


          </form>

        </section>


      </section>

    </main>
  );
};

export default PropertyDetails;
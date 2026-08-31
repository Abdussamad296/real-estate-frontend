import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Properties.css";

const Properties = () => {

    const navigate = useNavigate();

    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [filters, setFilters] = useState({
        search: "",
        purpose: "",
        propertyType: "",
        city: ""
    });

    const fetchProperties = async () => {
        try {
            setLoading(true);
            setError("");

            const params = {};

            if (filters.search) {
                params.search = filters.search;
            }

            if (filters.purpose) {
                params.purpose = filters.purpose;
            }

            if (filters.propertyType) {
                params.propertyType = filters.propertyType;
            }

            if (filters.city) {
                params.city = filters.city;
            }

            const response = await api.get("/property/public", {
                params
            });

            setProperties(response.data.data || []);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to fetch properties"
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProperties();
    };

    return (
        <main className="properties-page">

            {/* HEADER */}

            <section className="properties-header">

                <div>

                    <span>EXPLORE PROPERTIES</span>

                    <h1>
                        Find your perfect property
                    </h1>

                    <p>
                        Browse homes, apartments and properties
                        available for sale or rent.
                    </p>

                </div>

            </section>


            {/* FILTERS */}

            <section className="property-filters">

                <form onSubmit={handleSearch}>

                    <input
                        type="text"
                        name="search"
                        placeholder="Search properties..."
                        value={filters.search}
                        onChange={handleChange}
                    />

                    <select
                        name="purpose"
                        value={filters.purpose}
                        onChange={handleChange}
                    >

                        <option value="">
                            Buy or Rent
                        </option>

                        <option value="buy">
                            Buy
                        </option>

                        <option value="rent">
                            Rent
                        </option>

                    </select>


                    <select
                        name="propertyType"
                        value={filters.propertyType}
                        onChange={handleChange}
                    >

                        <option value="">
                            Property Type
                        </option>

                        <option value="apartment">
                            Apartment
                        </option>

                        <option value="house">
                            House
                        </option>

                        <option value="villa">
                            Villa
                        </option>

                        <option value="plot">
                            Plot
                        </option>

                        <option value="office">
                            Office
                        </option>

                        <option value="shop">
                            Shop
                        </option>

                    </select>


                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={filters.city}
                        onChange={handleChange}
                    />


                    <button type="submit">
                        Search
                    </button>

                </form>

            </section>


            {/* PROPERTY LIST */}

            <section className="properties-section">

                <div className="properties-top">

                    <h2>
                        Available Properties
                    </h2>

                    <span>
                        {properties.length} properties
                    </span>

                </div>


                {/* LOADING */}

                {loading && (
                    <p className="property-message">
                        Loading properties...
                    </p>
                )}


                {/* ERROR */}

                {error && (
                    <p className="property-message error">
                        {error}
                    </p>
                )}


                {/* EMPTY */}

                {!loading &&
                    !error &&
                    properties.length === 0 && (

                        <p className="property-message">
                            No properties found.
                        </p>

                    )
                }


                {/* PROPERTY CARDS */}

                {!loading &&
                    !error &&
                    properties.length > 0 && (

                        <div className="property-grid">

                            {properties.map((property) => (

                                <article
                                    className="property-card"
                                    key={property._id}
                                >

                                    {/* IMAGE */}

                                    <div className="property-image">

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


                                    {/* CONTENT */}

                                    <div className="property-content">

                                        <h3>
                                            {property.title}
                                        </h3>


                                        <p className="property-location">

                                            {property.location?.city},{" "}

                                            {property.location?.state}

                                        </p>


                                        <strong>

                                            ₹
                                            {property.price?.toLocaleString(
                                                "en-IN"
                                            )}

                                        </strong>


                                        {/* PROPERTY FEATURES */}

                                        <div className="property-details">

                                            <span>
                                                {property.bedrooms || 0}
                                                {" "}Beds
                                            </span>

                                            <span>
                                                {property.bathrooms || 0}
                                                {" "}Baths
                                            </span>

                                            <span>
                                                {property.area}
                                                {" "}sq.ft
                                            </span>

                                        </div>


                                        {/* VIEW DETAILS */}

                                        <button
                                            className="view-details-btn"
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

                            ))}

                        </div>

                    )
                }

            </section>

        </main>
    );
};

export default Properties;

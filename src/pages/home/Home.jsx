import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {

    const navigate = useNavigate();
    const [purpose, setPurpose] = useState("buy");

    const properties = [
        {
            id: 1,
            title: "Modern Luxury Villa",
            location: "Gurugram, Haryana",
            price: "₹1.85 Cr",
            type: "Villa",
            image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 2,
            title: "Premium Apartment",
            location: "Noida, Uttar Pradesh",
            price: "₹75 Lakh",
            type: "Apartment",
            image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 3,
            title: "Contemporary House",
            location: "Delhi, India",
            price: "₹1.25 Cr",
            type: "House",
            image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80"
        }
    ];

    const handleSearch = () => {
        navigate(`/properties?purpose=${purpose}`);
    };

    return (
        <>

            <main className="home">

                {/* HERO */}
                <section className="hero">

                    <div className="hero-content">

                        <span className="hero-tag">
                            FIND YOUR PERFECT PROPERTY
                        </span>

                        <h1>
                            Find a place you'll
                            <span> love to call home.</span>
                        </h1>

                        <p>
                            Discover beautiful homes, apartments and
                            properties that match your lifestyle.
                        </p>

                        {/* SEARCH BOX */}
                        <div className="property-search">

                            <div className="purpose-tabs">
                                <button
                                    className={purpose === "buy" ? "active" : ""}
                                    onClick={() => setPurpose("buy")}
                                >
                                    Buy
                                </button>

                                <button
                                    className={purpose === "rent" ? "active" : ""}
                                    onClick={() => setPurpose("rent")}
                                >
                                    Rent
                                </button>
                            </div>

                            <div className="search-fields">

                                <input
                                    type="text"
                                    placeholder="City or location"
                                />

                                <select>
                                    <option>Property Type</option>
                                    <option>Apartment</option>
                                    <option>House</option>
                                    <option>Villa</option>
                                    <option>Plot</option>
                                    <option>Office</option>
                                    <option>Shop</option>
                                </select>

                                <button onClick={handleSearch}>
                                    Search
                                </button>

                            </div>

                        </div>

                    </div>

                    <div className="hero-image">
                        <img
                            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80"
                            alt="Modern luxury home"
                        />
                    </div>

                </section>


                {/* FEATURED PROPERTIES */}
                <section className="featured">

                    <div className="section-heading">
                        <div>
                            <span>EXPLORE</span>
                            <h2>Featured Properties</h2>
                        </div>

                        <button onClick={() => navigate("/properties")}>
                            View all
                        </button>
                    </div>


                    <div className="property-grid">

                        {properties.map((property) => (

                            <article
                                className="property-card"
                                key={property.id}
                            >

                                <div className="property-image">

                                    <img
                                        src={property.image}
                                        alt={property.title}
                                    />

                                    <span className="property-type">
                                        {property.type}
                                    </span>

                                    <button className="favorite">
                                        ♡
                                    </button>

                                </div>

                                <div className="property-info">

                                    <h3>{property.title}</h3>

                                    <p>{property.location}</p>

                                    <strong>{property.price}</strong>

                                </div>

                            </article>

                        ))}

                    </div>

                </section>


                {/* CTA */}
                <section className="home-cta">

                    <div>
                        <span>READY TO FIND YOUR HOME?</span>

                        <h2>
                            Your next chapter starts here.
                        </h2>

                        <p>
                            Explore thousands of properties and find
                            the one that's right for you.
                        </p>
                    </div>

                    <button onClick={() => navigate("/properties")}>
                        Explore Properties
                    </button>

                </section>

            </main>
        </>
    );
};

export default Home;

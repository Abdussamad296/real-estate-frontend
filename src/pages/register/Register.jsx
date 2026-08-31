import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { IconHome, IconUser, IconMail, IconPhone, IconLock, IconEye, IconEyeOff } from "../../assets/icons/AuthIcons";
import "./Register.css";

const Register = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const response = await api.post(
                "/auth/register",
                formData
            );

            console.log(response.data);

            navigate("/login");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">

                {/* LEFT - FORM */}
                <div className="auth-form-section">
                    <div className="auth-form-content">

                        <span className="auth-logo">
                            <IconHome className="auth-logo-icon" />
                            Estate<span>Hub</span>
                        </span>

                        <h1>Create your account</h1>
                        <p className="auth-description">
                            Start exploring properties that match your lifestyle.
                        </p>

                        {error && <div className="auth-error">{error}</div>}

                        <form onSubmit={handleSubmit}>

                            <div className="input-group">
                                <label htmlFor="name">Name</label>
                                <div className="input-field">
                                    <IconUser className="input-icon" />
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label htmlFor="email">Email</label>
                                <div className="input-field">
                                    <IconMail className="input-icon" />
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label htmlFor="phone">Phone</label>
                                <div className="input-field">
                                    <IconPhone className="input-icon" />
                                    <input
                                        id="phone"
                                        type="text"
                                        name="phone"
                                        placeholder="Enter your phone number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label htmlFor="password">Password</label>
                                <div className="input-field">
                                    <IconLock className="input-icon" />
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="input-toggle"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <IconEyeOff /> : <IconEye />}
                                    </button>
                                </div>
                            </div>

                            <button className="auth-button" type="submit" disabled={loading}>
                                {loading ? "Creating account..." : "Create Account"}
                            </button>

                        </form>

                        <p className="auth-switch">
                            Already have an account?
                            <span onClick={() => navigate("/login")}>Sign in</span>
                        </p>

                    </div>
                </div>

                {/* RIGHT - IMAGE */}
                <div className="auth-image-section">
                    <img
                        src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
                        alt="Modern real estate property"
                    />
                    <div className="image-overlay"></div>
                    <div className="image-content">
                        <p className="image-eyebrow">FIND YOUR PLACE</p>
                        <h2>Your next chapter starts here.</h2>
                        <span className="image-subtext">
                            Discover beautiful homes, apartments and properties in the places you love.
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Register;

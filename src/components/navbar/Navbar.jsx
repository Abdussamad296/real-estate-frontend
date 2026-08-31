import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-inner">

                <Link to="/" className="navbar-logo">
                    Estate<span>Hub</span>
                </Link>

                <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
                    <Link to="/" onClick={() => setMenuOpen(false)}>
                        Home
                    </Link>

                    <Link to="/properties" onClick={() => setMenuOpen(false)}>
                        Properties
                    </Link>

                    {user?.role === "admin" && (
                        <Link
                            to="/admin/dashboard"
                            onClick={() => setMenuOpen(false)}
                        >
                            Dashboard
                        </Link>
                    )}

                    {user?.role === "agent" && (
                        <Link
                            to="/agent/dashboard"
                            onClick={() => setMenuOpen(false)}
                        >
                            Dashboard
                        </Link>
                    )}

                    {user?.role === "user" && (
                        <Link
                            to="/user/dashboard"
                            onClick={() => setMenuOpen(false)}
                        >
                            Dashboard
                        </Link>
                    )}

                    <Link
                        to="/profile"
                        onClick={() => setMenuOpen(false)}
                    >
                        Profile
                    </Link>

                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </div>

                <button
                    className="menu-button"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    ☰
                </button>

            </div>
        </nav>
    );
};

export default Navbar;
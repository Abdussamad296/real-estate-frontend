import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  IconHome,
  IconMail,
  IconLock,
  IconEye,
  IconEyeOff,
} from "../../assets/icons/AuthIcons";
import "./Login.css";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/login", formData);

      const token = response.data.data.token;
      const user = response.data.data.users;

      login(user,token);

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "agent") {
        navigate("/agent/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* LEFT - LOGIN FORM */}

        <div className="auth-form-section">
          <div className="auth-form-content">
            <span className="auth-logo">
              <IconHome className="auth-logo-icon" />
              Estate<span>Hub</span>
            </span>

            <h1>Welcome back</h1>

            <p className="auth-description">
              Sign in to continue exploring your perfect property.
            </p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* EMAIL */}

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

              {/* PASSWORD */}

              <div className="input-group">
                <label htmlFor="password">Password</label>

                <div className="input-field">
                  <IconLock className="input-icon" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
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
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="auth-switch">
              Don't have an account?
              <span onClick={() => navigate("/register")}>Create account</span>
            </p>
          </div>
        </div>

        {/* RIGHT - IMAGE */}

        <div className="auth-image-section">
          <img
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80"
            alt="Modern real estate property"
          />

          <div className="image-overlay"></div>

          <div className="image-content">
            <p className="image-eyebrow">WELCOME HOME</p>

            <h2>Find a place that feels like home.</h2>

            <span className="image-subtext">
              Explore beautiful homes, apartments and properties in the places
              you love.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

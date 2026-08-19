import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      console.log("Login response:", data);

      if (!response.ok) {
        alert(data.message || "Login failed.");
        return;
      }

      const accessToken = data.session?.access_token;

      if (!accessToken) {
        alert("Login succeeded, but no access token was received.");
        return;
      }

      localStorage.setItem("accessToken", accessToken);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert("Login successful!");

      // Redirect according to the user's role
      if (data.user?.role === "PATIENT") {
        navigate("/patient/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to connect to the server.");
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">

        {/* Left side */}
        <section className="auth-info">
          <div className="auth-logo">
            <span>MEDI</span>
            <strong>GUIDE</strong>
          </div>

          <p className="eyebrow">WELCOME BACK</p>

          <h1>
            Your health,
            <span> within reach.</span>
          </h1>

          <p>
            Sign in to access your MEDIGUIDE account, manage your
            health information, check symptoms, and stay connected
            with your healthcare journey.
          </p>

          <div className="auth-benefits">
            <div>
              <span>✓</span>
              Secure access to your account
            </div>

            <div>
              <span>✓</span>
              Manage your health information
            </div>

            <div>
              <span>✓</span>
              Access your personalized dashboard
            </div>
          </div>
        </section>

        {/* Login form */}
        <section className="auth-form-section">
          <div className="auth-form-container">

            <h2>Welcome back</h2>

            <p className="auth-subtitle">
              Sign in to continue to MEDIGUIDE.
            </p>

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  Password
                </label>

                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="forgot-password">
                <a href="/forgot-password">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="auth-button"
              >
                Login
              </button>

            </form>

            <p className="auth-switch">
              Don't have an account?{" "}
              <a href="/register">Create an account</a>
            </p>

          </div>
        </section>

      </div>
    </main>
  );
}

export default Login;
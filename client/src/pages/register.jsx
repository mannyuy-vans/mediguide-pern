import { useState } from "react";
import "../App.css";

function Register() {
  const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await response.json();

    console.log("Registration response:", data);

    if (!response.ok) {
      alert(data.message || "Registration failed.");
      return;
    }

    alert("Registration successful! Please check your email to confirm your account.");

  } catch (error) {
    console.error("Registration error:", error);
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

          <p className="eyebrow">JOIN MEDIGUIDE</p>

          <h1>
            Your health,
            <span> better understood.</span>
          </h1>

          <p>
            Create your MEDIGUIDE account and gain access to
            personalized health guidance, symptom checking,
            appointments, and more.
          </p>

          <div className="auth-benefits">
            <div>
              <span>✓</span>
              Personalized health guidance
            </div>

            <div>
              <span>✓</span>
              Secure patient account
            </div>

            <div>
              <span>✓</span>
              Access your health history
            </div>
          </div>
        </section>

        {/* Register form */}
        <section className="auth-form-section">

          <div className="auth-form-container">

            <h2>Create your account</h2>

            <p className="auth-subtitle">
              Sign up to get started with MEDIGUIDE.
            </p>

            <form onSubmit={handleSubmit}>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">
                    First Name
                  </label>

                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter First name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">
                    Last Name
                  </label>

                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    required
                  />
                </div>

              </div>

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
                  placeholder="Create a password"
                  required
                />
              </div>
              <div className="form-group">
                    <label htmlFor="confirmPassword">
                        Confirm Password
                    </label>

                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        required
                    />
                </div>

              <button
                type="submit"
                className="auth-button"
              >
                Create Account
              </button>

            </form>

            <p className="auth-switch">
              Already have an account?{" "}
              <a href="/login">Log in</a>
            </p>

          </div>

        </section>

      </div>

    </main>
  );
}

export default Register;
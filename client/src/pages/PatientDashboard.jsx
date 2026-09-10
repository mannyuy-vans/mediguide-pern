import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PatientDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to read user:", error);
      }
    }

    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <main className="dashboard-main">
          <p>Loading dashboard...</p>
        </main>
      </div>
    );
  }

  const firstName = user?.firstName || "Patient";
  const lastName = user?.lastName || "";

  return (
    <div className="dashboard-page">

      {/* ==========================
          SIDEBAR
      =========================== */}
      <aside className="dashboard-sidebar">

        <div className="dashboard-logo">
          <strong>MEDI</strong>
          <span>GUIDE</span>
        </div>

        <div className="dashboard-role">
          <span className="role-dot"></span>
          Patient
        </div>

        <nav className="dashboard-nav">

          <button
            className="active"
            onClick={() => navigate("/patient/dashboard")}
          >
            <span>▦</span>
            Overview
          </button>

          <button
            onClick={() => navigate("/patient/profile")}
          >
            <span>♙</span>
            My Profile
          </button>

          <button
            onClick={() => navigate("/patient/symptom-checker")}
          >
            <span>♧</span>
            Symptom Checker
          </button>

          <button
            onClick={() => navigate("/patient/appointments")}
          >
            <span>◷</span>
            Appointments
          </button>

          <button
            onClick={() => navigate("/patient/history")}
          >
            <span>☷</span>
            Medical History
          </button>

          <button
            onClick={() => navigate("/patient/diagnoses")}
          >
            <span>♡</span>
            Diagnoses & Prescriptions
          </button>

          <button
            onClick={() => navigate("/patient/consultations")}
          >
            <span>♧</span>
            Consultations
          </button>

          <button
            onClick={() => navigate("/patient/records")}
          >
            <span>▤</span>
            Medical Records
          </button>

          <button
            onClick={() => navigate("/patient/notifications")}
          >
            <span>♧</span>
            Notifications
          </button>

          <button
            onClick={() => navigate("/patient/settings")}
          >
            <span>⚙</span>
            Settings
          </button>

        </nav>

        <button
          className="dashboard-logout"
          onClick={handleLogout}
        >
          <span>↪</span>
          Logout
        </button>

      </aside>

      {/* ==========================
          MAIN CONTENT
      =========================== */}
      <main className="dashboard-main">

        {/* HEADER */}
        <header className="dashboard-header">

          <div>
            <p className="dashboard-eyebrow">
              PATIENT PORTAL
            </p>

            <h1>Dashboard</h1>

            <p>
              Welcome back, {firstName}. Here's your health overview.
            </p>
          </div>

          {/* PATIENT PROFILE */}
          <div className="admin-profile">

            <div className="admin-avatar">
              {firstName.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>
                {firstName} {lastName}
              </strong>

              <small>
                Patient
              </small>
            </div>

          </div>

        </header>

        {/* ==========================
            STATISTICS
        =========================== */}
        <section className="dashboard-stats">

          <div className="stat-card">
            <div className="stat-icon">
              ◷
            </div>

            <div>
              <span>Appointments</span>
              <strong>0</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              ♡
            </div>

            <div>
              <span>Diagnoses</span>
              <strong>0</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              ♧
            </div>

            <div>
              <span>Consultations</span>
              <strong>0</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              ▤
            </div>

            <div>
              <span>Medical Records</span>
              <strong>0</strong>
            </div>
          </div>

        </section>

        {/* ==========================
            MAIN GRID
        =========================== */}
        <section className="dashboard-grid">

          {/* UPCOMING APPOINTMENTS */}
          <div className="dashboard-card">

            <div className="card-heading">

              <div>
                <p className="dashboard-eyebrow">
                  APPOINTMENTS
                </p>

                <h2>
                  Upcoming Appointments
                </h2>
              </div>

              <button
                className="primary-dashboard-button"
                onClick={() =>
                  navigate("/patient/appointments")
                }
              >
                View All
              </button>

            </div>

            <div className="empty-state">

              <div className="empty-icon">
                ◷
              </div>

              <h3>
                No upcoming appointments
              </h3>

              <p>
                Your upcoming doctor appointments
                will appear here.
              </p>

              <button
                className="primary-dashboard-button"
                onClick={() =>
                  navigate("/patient/appointments")
                }
                style={{ marginTop: "15px" }}
              >
                Book Appointment
              </button>

            </div>

          </div>

          {/* HEALTH PROFILE */}
          <div className="dashboard-card">

            <div className="card-heading">

              <div>
                <p className="dashboard-eyebrow">
                  HEALTH PROFILE
                </p>

                <h2>
                  My Profile
                </h2>
              </div>

              <button
                className="primary-dashboard-button"
                onClick={() =>
                  navigate("/patient/profile")
                }
              >
                View Profile
              </button>

            </div>

            <div className="empty-state">

              <div className="empty-icon">
                ♙
              </div>

              <h3>
                Keep your profile updated
              </h3>

              <p>
                Add your date of birth, gender,
                blood group, phone number and
                address.
              </p>

              <button
                className="primary-dashboard-button"
                onClick={() =>
                  navigate("/patient/profile")
                }
                style={{ marginTop: "15px" }}
              >
                Update Profile
              </button>

            </div>

          </div>

        </section>

        {/* ==========================
            QUICK ACTIONS
        =========================== */}
        <section
          className="dashboard-card"
          style={{ marginTop: "22px" }}
        >

          <div className="card-heading">

            <div>
              <p className="dashboard-eyebrow">
                QUICK ACTIONS
              </p>

              <h2>
                What would you like to do?
              </h2>
            </div>

          </div>

          <div className="dashboard-grid">

            <div>
              <button
                className="primary-dashboard-button"
                onClick={() =>
                  navigate("/patient/symptom-checker")
                }
              >
                Start Symptom Checker
              </button>

              <p style={{ marginTop: "12px" }}>
                Check your symptoms and receive
                preliminary health guidance.
              </p>
            </div>

            <div>
              <button
                className="primary-dashboard-button"
                onClick={() =>
                  navigate("/patient/appointments")
                }
              >
                Find a Doctor
              </button>

              <p style={{ marginTop: "12px" }}>
                View available doctors and manage
                your appointments.
              </p>
            </div>

          </div>

        </section>

      </main>
    </div>
  );
}

export default PatientDashboard;
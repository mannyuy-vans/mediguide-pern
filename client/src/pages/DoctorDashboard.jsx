import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function DoctorDashboard() {
  const navigate = useNavigate();

  // Logged-in user
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  // Doctor profile
  const [doctor, setDoctor] = useState(user);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Patients
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);

  // Doctor profile picture
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("doctorProfileImage") || ""
  );

  // ==============================
  // LOGOUT
  // ==============================

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("doctorProfileImage");

    navigate("/login");
  };

  // ==============================
  // PROFILE IMAGE
  // ==============================

  const handleProfileImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const image = reader.result;

      setProfileImage(image);

      localStorage.setItem(
        "doctorProfileImage",
        image
      );
    };

    reader.readAsDataURL(file);
  };

  // ==============================
  // FETCH DOCTOR PROFILE
  // ==============================

  const fetchDoctorProfile = async () => {
    try {
      const token =
        localStorage.getItem("accessToken");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/doctor/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load doctor profile"
        );
      }

      setDoctor(data.doctor);

      localStorage.setItem(
        "user",
        JSON.stringify(data.doctor)
      );
    } catch (error) {
      console.error(
        "Doctor profile error:",
        error
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  // ==============================
  // FETCH PATIENTS
  // ==============================

  const fetchPatients = async () => {
    try {
      const token =
        localStorage.getItem("accessToken");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/doctor/patients",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load patients"
        );
      }

      console.log(
        "Patients loaded:",
        data
      );

      setPatients(data.patients || []);
    } catch (error) {
      console.error(
        "Patients error:",
        error
      );
    } finally {
      setLoadingPatients(false);
    }
  };

  // ==============================
  // LOAD DATA
  // ==============================

  useEffect(() => {
    fetchDoctorProfile();
    fetchPatients();
  }, []);

  // ==============================
  // LOADING SCREEN
  // ==============================

  if (loadingProfile) {
    return (
      <div className="dashboard-page">
        <main className="dashboard-main">
          <div className="empty-state">
            <div className="empty-icon">
              ◷
            </div>

            <h3>
              Loading your dashboard...
            </h3>

            <p>
              Please wait while we retrieve
              your information.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ==============================
  // DASHBOARD
  // ==============================

  return (
    <div className="dashboard-page">

      {/* ==========================
          SIDEBAR
      =========================== */}

      <aside className="dashboard-sidebar">

        <div className="dashboard-logo">
          <span>MEDI</span>
          <strong>GUIDE</strong>
        </div>

        <div className="dashboard-role">
          <span className="role-dot"></span>
          Doctor
        </div>

        <nav className="dashboard-nav">

          <button
            className="active"
            onClick={() =>
              navigate("/doctor/dashboard")
            }
          >
            <span>▦</span>
            Overview
          </button>

          <button
            onClick={() =>
              navigate("/doctor/patients")
            }
          >
            <span>♙</span>
            My Patients
          </button>

          <button
            onClick={() =>
              navigate("/doctor/appointments")
            }
          >
            <span>◷</span>
            Appointments
          </button>

          <button
            onClick={() =>
              navigate("/doctor/consultations")
            }
          >
            <span>♡</span>
            Consultations
          </button>

          <button
            onClick={() =>
              navigate("/doctor/notifications")
            }
          >
            <span>♧</span>
            Notifications
          </button>

          <button
            onClick={() =>
              navigate("/doctor/settings")
            }
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
              DOCTOR PORTAL
            </p>

            <h1>
              Dashboard
            </h1>

            <p>
              Welcome back, Dr.{" "}
              {doctor.firstName ||
                "Doctor"}.
              Here's what's happening
              with MEDIGUIDE.
            </p>

          </div>

          {/* PROFILE */}

          <div className="admin-profile">

            <label className="admin-avatar-upload">

              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Doctor profile"
                  className="admin-avatar-image"
                />
              ) : (
                <span>
                  {doctor.firstName
                    ?.charAt(0)
                    ?.toUpperCase() || "D"}
                </span>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={
                  handleProfileImage
                }
                hidden
              />

              <span className="avatar-camera">
                +
              </span>

            </label>

            <div>

              <strong>
                Dr.{" "}
                {doctor.firstName ||
                  "Doctor"}{" "}
                {doctor.lastName || ""}
              </strong>

              <small>
                Doctor
              </small>

            </div>

          </div>

        </header>

        {/* ==========================
            STATISTICS
        =========================== */}

        <section className="dashboard-stats">

          {/* PATIENTS */}

          <div className="stat-card">

            <div className="stat-icon">
              ♙
            </div>

            <div>

              <span>
                My Patients
              </span>

              <strong>
                {patients.length}
              </strong>

            </div>

          </div>

          {/* APPOINTMENTS */}

          <div className="stat-card">

            <div className="stat-icon">
              ◷
            </div>

            <div>

              <span>
                Today's Appointments
              </span>

              <strong>
                0
              </strong>

            </div>

          </div>

          {/* CONSULTATIONS */}

          <div className="stat-card">

            <div className="stat-icon">
              ♡
            </div>

            <div>

              <span>
                Consultations
              </span>

              <strong>
                0
              </strong>

            </div>

          </div>

          {/* NOTIFICATIONS */}

          <div className="stat-card">

            <div className="stat-icon">
              ♧
            </div>

            <div>

              <span>
                Notifications
              </span>

              <strong>
                0
              </strong>

            </div>

          </div>

        </section>

        {/* ==========================
            DASHBOARD GRID
        =========================== */}

        <section className="dashboard-grid">

          {/* ========================
              UPCOMING APPOINTMENTS
          ========================= */}

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
                  navigate(
                    "/doctor/appointments"
                  )
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
                Your upcoming patient
                appointments will appear
                here.
              </p>

            </div>

          </div>

          {/* ========================
              RECENT PATIENTS
          ========================= */}

          <div className="dashboard-card">

            <div className="card-heading">

              <div>

                <p className="dashboard-eyebrow">
                  PATIENTS
                </p>

                <h2>
                  Recent Patients
                </h2>

              </div>

              <button
                className="primary-dashboard-button"
                onClick={() =>
                  navigate(
                    "/doctor/patients"
                  )
                }
              >
                View All
              </button>

            </div>

            {loadingPatients ? (
              <div className="empty-state">

                <div className="empty-icon">
                  ◷
                </div>

                <h3>
                  Loading patients...
                </h3>

              </div>
            ) : patients.length === 0 ? (
              <div className="empty-state">

                <div className="empty-icon">
                  ♙
                </div>

                <h3>
                  No patients yet
                </h3>

                <p>
                  Patients assigned to you
                  will appear here.
                </p>

              </div>
            ) : (
              <div className="recent-patients-list">

                {patients
                  .slice(0, 4)
                  .map((patient) => (
                    <div
                      key={patient.id}
                      className="patient-row"
                    >

                      <div className="patient-avatar">
                        {patient.firstName
                          ?.charAt(0)
                          ?.toUpperCase() || "P"}
                      </div>

                      <div className="patient-info">

                        <strong>
                          {patient.firstName}{" "}
                          {patient.lastName}
                        </strong>

                        <span>
                          {patient.email}
                        </span>

                      </div>

                      <button
                        className="patient-view-button"
                        onClick={() =>
                          navigate(
                            `/doctor/patients/${patient.id}`
                          )
                        }
                      >
                        View
                      </button>

                    </div>
                  ))}

              </div>
            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default DoctorDashboard;
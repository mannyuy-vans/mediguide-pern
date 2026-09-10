import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const accessToken = localStorage.getItem("accessToken");

  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("adminProfileImage") || ""
  );

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  const [showDoctorForm, setShowDoctorForm] = useState(false);

  const [doctorForm, setDoctorForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [creatingDoctor, setCreatingDoctor] = useState(false);

  const [doctorMessage, setDoctorMessage] = useState("");

  /* =========================================
     NAVIGATION
  ========================================= */

  const goTo = (path) => {
    navigate(path);
  };

  /* =========================================
     LOGOUT
  ========================================= */

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    navigate("/login");
  };

  /* =========================================
     PROFILE IMAGE
  ========================================= */

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
        "adminProfileImage",
        image
      );
    };

    reader.readAsDataURL(file);
  };

  /* =========================================
     GET ALL DOCTORS
  ========================================= */

  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);

      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        "http://localhost:5000/api/admin/doctors",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load doctors"
        );
      }

      setDoctors(data.doctors || []);
    } catch (error) {
      console.error(
        "Error loading doctors:",
        error
      );
    } finally {
      setLoadingDoctors(false);
    }
  };

  /* =========================================
     LOAD DOCTORS WHEN DASHBOARD OPENS
  ========================================= */

  useEffect(() => {
    fetchDoctors();
  }, []);

  /* =========================================
     DOCTOR FORM INPUT
  ========================================= */

  const handleDoctorChange = (e) => {
    const { name, value } = e.target;

    setDoctorForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================================
     CREATE DOCTOR
  ========================================= */

  const handleCreateDoctor = async (e) => {
    e.preventDefault();

    setDoctorMessage("");
    setCreatingDoctor(true);

    try {
      const token =
        localStorage.getItem("accessToken");

      const response = await fetch(
        "http://localhost:5000/api/admin/doctors",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(doctorForm),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to create doctor"
        );
      }

      setDoctorMessage(
        "Doctor account created successfully!"
      );

      /* Clear form */

      setDoctorForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });

      /* Close form */

      setShowDoctorForm(false);

      /* Refresh doctor list */

      await fetchDoctors();
    } catch (error) {
      console.error(
        "Doctor creation error:",
        error
      );

      setDoctorMessage(
        error.message ||
          "Something went wrong while creating the doctor."
      );
    } finally {
      setCreatingDoctor(false);
    }
  };

  /* =========================================
     RETURN
  ========================================= */

  return (
    <div className="dashboard-page">

      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside className="dashboard-sidebar">

        <div className="dashboard-logo">
          <span>MEDI</span>
          <strong>GUIDE</strong>
        </div>

        <div className="dashboard-role">
          <span className="role-dot"></span>
          Administrator
        </div>

        <nav className="dashboard-nav">

          <button
            className="active"
            onClick={() =>
              goTo("/admin/dashboard")
            }
          >
            <span>▦</span>
            Overview
          </button>

          <button
            onClick={() =>
              goTo("/admin/doctors")
            }
          >
            <span>♟</span>
            Doctors
          </button>

          <button
            onClick={() =>
              goTo("/admin/patients")
            }
          >
            <span>♙</span>
            Patients
          </button>

          <button
            onClick={() =>
              goTo("/admin/appointments")
            }
          >
            <span>◷</span>
            Appointments
          </button>

          <button
            onClick={() =>
              goTo("/admin/notifications")
            }
          >
            <span>♧</span>
            Notifications
          </button>

          <button
            onClick={() =>
              goTo("/admin/settings")
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

      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <main className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>

            <p className="dashboard-eyebrow">
              ADMIN PORTAL
            </p>

            <h1>Dashboard</h1>

            <p>
              Welcome back,{" "}
              {user.firstName ||
                "Administrator"}
              . Here's what's happening
              with MEDIGUIDE.
            </p>

          </div>

          {/* ADMIN PROFILE */}

          <div className="admin-profile">

            <label className="admin-avatar-upload">

              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Admin profile"
                  className="admin-avatar-image"
                />
              ) : (
                <span>
                  {user.firstName?.charAt(0) ||
                    "A"}
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
                {user.firstName ||
                  "MEDIGUIDE"}{" "}
                {user.lastName ||
                  "Administrator"}
              </strong>

              <small>
                Administrator
              </small>

            </div>

          </div>

        </header>

        {/* =====================================
            STATISTICS
        ===================================== */}

        <section className="dashboard-stats">

          <div className="stat-card">

            <div className="stat-icon">
              ♙
            </div>

            <div>
              <span>
                Total Patients
              </span>

              <strong>0</strong>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              ♟
            </div>

            <div>

              <span>
                Total Doctors
              </span>

              <strong>
                {doctors.length}
              </strong>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              ◷
            </div>

            <div>

              <span>
                Appointments
              </span>

              <strong>0</strong>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              ♡
            </div>

            <div>

              <span>
                Active Users
              </span>

              <strong>0</strong>

            </div>

          </div>

        </section>

        {/* =====================================
            MAIN GRID
        ===================================== */}

        <section className="dashboard-grid">

          {/* ===================================
              DOCTOR MANAGEMENT
          =================================== */}

          <div className="dashboard-card">

            <div className="card-heading">

              <div>

                <p className="dashboard-eyebrow">
                  DOCTORS
                </p>

                <h2>
                  Doctor Management
                </h2>

              </div>

              <button
                className="primary-dashboard-button"
                onClick={() => {
                  setDoctorMessage("");
                  setShowDoctorForm(
                    !showDoctorForm
                  );
                }}
              >
                {showDoctorForm
                  ? "Cancel"
                  : "+ Add Doctor"}
              </button>

            </div>

            {/* =================================
                SUCCESS / ERROR MESSAGE
            ================================= */}

            {doctorMessage && (
              <div className="doctor-message">
                {doctorMessage}
              </div>
            )}

            {/* =================================
                ADD DOCTOR FORM
            ================================= */}

            {showDoctorForm && (

              <form
                className="doctor-form"
                onSubmit={
                  handleCreateDoctor
                }
              >

                <div className="form-row">

                  <div className="form-group">

                    <label>
                      First Name
                    </label>

                    <input
                      type="text"
                      name="firstName"
                      value={
                        doctorForm.firstName
                      }
                      onChange={
                        handleDoctorChange
                      }
                      placeholder="Enter first name"
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Last Name
                    </label>

                    <input
                      type="text"
                      name="lastName"
                      value={
                        doctorForm.lastName
                      }
                      onChange={
                        handleDoctorChange
                      }
                      placeholder="Enter last name"
                      required
                    />

                  </div>

                </div>

                <div className="form-group">

                  <label>
                    Doctor Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={
                      doctorForm.email
                    }
                    onChange={
                      handleDoctorChange
                    }
                    placeholder="doctor@mediguide.com"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Temporary Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={
                      doctorForm.password
                    }
                    onChange={
                      handleDoctorChange
                    }
                    placeholder="Create a temporary password"
                    minLength={6}
                    required
                  />

                </div>

                <button
                  type="submit"
                  className="primary-dashboard-button"
                  disabled={creatingDoctor}
                >
                  {creatingDoctor
                    ? "Creating Doctor..."
                    : "Create Doctor"}
                </button>

              </form>

            )}

            {/* =================================
                DOCTOR LIST
            ================================= */}

            {!showDoctorForm && (

              <div className="doctor-list">

                {loadingDoctors ? (

                  <div className="empty-state">

                    <h3>
                      Loading doctors...
                    </h3>

                  </div>

                ) : doctors.length ===
                  0 ? (

                  <div className="empty-state">

                    <div className="empty-icon">
                      ♟
                    </div>

                    <h3>
                      No doctors yet
                    </h3>

                    <p>
                      Add doctors to
                      MEDIGUIDE so they can
                      manage patients and
                      appointments.
                    </p>

                  </div>

                ) : (

                  doctors.map((doctor) => (

                    <div
                      className="doctor-list-item"
                      key={doctor.id}
                    >

                      <div className="doctor-avatar">
                        {doctor.firstName?.charAt(
                          0
                        )}
                      </div>

                      <div className="doctor-info">

                        <strong>
                          Dr.{" "}
                          {doctor.firstName}{" "}
                          {doctor.lastName}
                        </strong>

                        <span>
                          {doctor.email}
                        </span>

                      </div>

                      <div className="doctor-role">
                        {doctor.role}
                      </div>

                    </div>

                  ))

                )}

              </div>

            )}

          </div>

          {/* ===================================
              RECENT ACTIVITY
          =================================== */}

          <div className="dashboard-card">

            <div className="card-heading">

              <div>

                <p className="dashboard-eyebrow">
                  ACTIVITY
                </p>

                <h2>
                  Recent Activity
                </h2>

              </div>

            </div>

            <div className="empty-state">

              <div className="empty-icon">
                ◷
              </div>

              <h3>
                No recent activity
              </h3>

              <p>
                System activity will appear
                here once users begin
                interacting with MEDIGUIDE.
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;
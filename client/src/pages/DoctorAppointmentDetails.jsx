import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../App.css";

function DoctorAppointmentDetails() {
  const navigate = useNavigate();
  const { appointmentId } = useParams();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const profileImage =
    localStorage.getItem("doctorProfileImage") || "";

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

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
  // FETCH APPOINTMENT
  // ==============================

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("accessToken");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/doctor/appointments/${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load appointment"
        );
      }

      setAppointment(data.appointment);
    } catch (error) {
      console.error("Appointment details error:", error);

      setError(
        error.message || "Unable to load appointment"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, [appointmentId]);

  // ==============================
  // UPDATE STATUS
  // ==============================

  const updateStatus = async (status) => {
    try {
      setUpdating(true);
      setError("");

      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `http://localhost:5000/api/doctor/appointments/${appointmentId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update appointment"
        );
      }

      setAppointment((current) => ({
        ...current,
        status: data.appointment.status,
      }));
    } catch (error) {
      console.error("Status update error:", error);

      setError(
        error.message || "Unable to update appointment"
      );
    } finally {
      setUpdating(false);
    }
  };

  // ==============================
  // FORMAT DATE
  // ==============================

  const formatDate = (date) => {
    if (!date) return "Not provided";

    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // ==============================
  // FORMAT DATE OF BIRTH
  // ==============================

  const formatDateOfBirth = (date) => {
    if (!date) return "Not provided";

    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // ==============================
  // FORMAT TIME
  // ==============================

  const formatTime = (date) => {
    if (!date) return "Not provided";

    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="dashboard-page">
        <main className="dashboard-main">
          <div className="appointment-page-loading">
            <div className="appointment-loading-icon">
              ◷
            </div>

            <h3>Loading appointment...</h3>

            <p>
              Please wait while we retrieve the appointment
              details.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ==============================
  // ERROR / NOT FOUND
  // ==============================

  if (error || !appointment) {
    return (
      <div className="dashboard-page">
        <main className="dashboard-main">
          <div className="appointment-page-error">
            <div className="appointment-error-icon">
              !
            </div>

            <h3>Unable to load appointment</h3>

            <p>
              {error ||
                "The requested appointment could not be found."}
            </p>

            <button
              className="primary-dashboard-button"
              onClick={() =>
                navigate("/doctor/appointments")
              }
            >
              ← Back to Appointments
            </button>
          </div>
        </main>
      </div>
    );
  }

  const patient = appointment.patient;
  const patientProfile = patient?.patientProfile;

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
            className="active"
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

            <h1>Appointment Details</h1>

            <p>
              Review and manage this patient appointment.
            </p>
          </div>

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
                  {user.firstName
                    ?.charAt(0)
                    ?.toUpperCase() || "D"}
                </span>
              )}

            </label>

            <div>
              <strong>
                Dr. {user.firstName || "Doctor"}{" "}
                {user.lastName || ""}
              </strong>

              <small>Doctor</small>
            </div>

          </div>

        </header>

        {/* BACK BUTTON */}

        <button
          className="appointment-back-button"
          onClick={() =>
            navigate("/doctor/appointments")
          }
        >
          ← Back to Appointments
        </button>

        {/* ERROR */}

        {error && (
          <div className="appointment-error">
            {error}
          </div>
        )}

        {/* ==========================
            APPOINTMENT DETAILS
        =========================== */}

        <section className="appointment-details-grid">

          {/* ==========================
              PATIENT INFORMATION
          =========================== */}

          <div className="dashboard-card appointment-details-card">

            <div className="card-heading">
              <div>
                <p className="dashboard-eyebrow">
                  PATIENT
                </p>

                <h2>Patient Information</h2>
              </div>
            </div>

            {/* PATIENT HEADER */}

            <div className="appointment-patient-large">

              <div className="appointment-patient-large-avatar">
                {patient?.firstName
                  ?.charAt(0)
                  ?.toUpperCase() || "P"}
              </div>

              <div>
                <h3>
                  {patient?.firstName || ""}{" "}
                  {patient?.lastName || ""}
                </h3>

                <p>
                  {patient?.email ||
                    "No email available"}
                </p>
              </div>

            </div>

            {/* PATIENT DETAILS */}

            <div className="patient-detail-list">

              <div className="patient-detail-item">
                <span>Email</span>
                <strong>
                  {patient?.email || "Not provided"}
                </strong>
              </div>

              <div className="patient-detail-item">
                <span>Gender</span>
                <strong>
                  {patientProfile?.gender ||
                    "Not provided"}
                </strong>
              </div>

              <div className="patient-detail-item">
                <span>Date of Birth</span>
                <strong>
                  {formatDateOfBirth(
                    patientProfile?.dateOfBirth
                  )}
                </strong>
              </div>

              <div className="patient-detail-item">
                <span>Blood Group</span>
                <strong>
                  {patientProfile?.bloodGroup ||
                    "Not provided"}
                </strong>
              </div>

              <div className="patient-detail-item">
                <span>Phone</span>
                <strong>
                  {patientProfile?.phone ||
                    "Not provided"}
                </strong>
              </div>

              <div className="patient-detail-item">
                <span>Address</span>
                <strong>
                  {patientProfile?.address ||
                    "Not provided"}
                </strong>
              </div>

            </div>

          </div>

          {/* ==========================
              APPOINTMENT INFORMATION
          =========================== */}

          <div className="dashboard-card appointment-details-card">

            <div className="card-heading">

              <div>
                <p className="dashboard-eyebrow">
                  APPOINTMENT
                </p>

                <h2>Appointment Information</h2>
              </div>

              <span
                className={`appointment-status status-${appointment.status.toLowerCase()}`}
              >
                {appointment.status}
              </span>

            </div>

            <div className="appointment-information">

              <div className="appointment-info-item">
                <span>Date</span>

                <strong>
                  {formatDate(
                    appointment.scheduledAt
                  )}
                </strong>
              </div>

              <div className="appointment-info-item">
                <span>Time</span>

                <strong className="appointment-highlight">
                  {formatTime(
                    appointment.scheduledAt
                  )}
                </strong>
              </div>

              <div className="appointment-info-item">
                <span>Reason for Visit</span>

                <strong>
                  {appointment.reason ||
                    "General consultation"}
                </strong>
              </div>

              <div className="appointment-info-item">
                <span>Notes</span>

                <strong className="appointment-notes">
                  {appointment.notes ||
                    "No notes provided"}
                </strong>
              </div>

            </div>

            {/* ACTIONS */}

            <div className="appointment-detail-actions">

              {appointment.status === "PENDING" && (
                <>
                  <button
                    className="appointment-confirm large"
                    disabled={updating}
                    onClick={() =>
                      updateStatus("CONFIRMED")
                    }
                  >
                    {updating
                      ? "Updating..."
                      : "Confirm Appointment"}
                  </button>

                  <button
                    className="appointment-reject large"
                    disabled={updating}
                    onClick={() =>
                      updateStatus("REJECTED")
                    }
                  >
                    {updating
                      ? "Updating..."
                      : "Reject Appointment"}
                  </button>
                </>
              )}

              {appointment.status === "CONFIRMED" && (
                <button
                  className="appointment-complete large"
                  disabled={updating}
                  onClick={() =>
                    updateStatus("COMPLETED")
                  }
                >
                  {updating
                    ? "Updating..."
                    : "Mark as Completed"}
                </button>
              )}

            </div>

          </div>

        </section>

      </main>
    </div>
  );
}

export default DoctorAppointmentDetails;
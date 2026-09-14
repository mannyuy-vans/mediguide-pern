import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../App.css";

const API_BASE_URL = "http://localhost:5000/api";

function PatientAppointmentDetails() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchAppointment();
  }, [appointmentId]);

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `${API_BASE_URL}/patient/appointments/${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load appointment details."
        );
      }

      setAppointment(data.appointment);
    } catch (err) {
      setError(err.message || "Unable to load appointment.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmed) return;

    try {
      setCancelling(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `${API_BASE_URL}/patient/appointments/${appointmentId}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to cancel appointment."
        );
      }

      setAppointment(data.appointment);
      setSuccess("Appointment cancelled successfully.");
    } catch (err) {
      setError(err.message || "Unable to cancel appointment.");
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatCreatedDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "status-confirmed";

      case "PENDING":
        return "status-pending";

      case "COMPLETED":
        return "status-completed";

      case "CANCELLED":
        return "status-cancelled";

      case "REJECTED":
        return "status-rejected";

      default:
        return "";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "Confirmed";

      case "PENDING":
        return "Pending";

      case "COMPLETED":
        return "Completed";

      case "CANCELLED":
        return "Cancelled";

      case "REJECTED":
        return "Rejected";

      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <aside className="dashboard-sidebar">
          <div className="dashboard-logo">
            <div className="dashboard-logo-mark">M</div>
            <div>
              <h2>MEDIGUIDE</h2>
              <span>Patient Portal</span>
            </div>
          </div>

          <div className="dashboard-role">
            <span>●</span> PATIENT
          </div>

          <nav className="dashboard-nav">
            <button onClick={() => navigate("/patient/dashboard")}>
              <span>⌂</span>
              Overview
            </button>

            <button onClick={() => navigate("/patient/profile")}>
              <span>◉</span>
              My Profile
            </button>

            <button
              className="active"
              onClick={() => navigate("/patient/appointments")}
            >
              <span>▣</span>
              Appointments
            </button>

            <button>
              <span>✚</span>
              Symptom Checker
            </button>

            <button>
              <span>▤</span>
              Medical History
            </button>

            <button>
              <span>☑</span>
              Diagnoses & Prescriptions
            </button>

            <button>
              <span>◌</span>
              Consultations
            </button>

            <button>
              <span>▧</span>
              Medical Records
            </button>

            <button>
              <span>🔔</span>
              Notifications
            </button>

            <button>
              <span>⚙</span>
              Settings
            </button>
          </nav>
        </aside>

        <main className="dashboard-main">
          <div className="appointment-details-loading">
            Loading appointment details...
          </div>
        </main>
      </div>
    );
  }

  if (error && !appointment) {
    return (
      <div className="dashboard-page">
        <aside className="dashboard-sidebar">
          <div className="dashboard-logo">
            <div className="dashboard-logo-mark">M</div>
            <div>
              <h2>MEDIGUIDE</h2>
              <span>Patient Portal</span>
            </div>
          </div>

          <div className="dashboard-role">
            <span>●</span> PATIENT
          </div>
        </aside>

        <main className="dashboard-main">
          <div className="appointment-error-page">
            <h2>Unable to load appointment</h2>
            <p>{error}</p>

            <button
              className="primary-btn"
              onClick={() => navigate("/patient/appointments")}
            >
              Back to Appointments
            </button>
          </div>
        </main>
      </div>
    );
  }

  const doctor = appointment?.doctor;

  const canCancel =
    appointment?.status === "PENDING" ||
    appointment?.status === "CONFIRMED";

  return (
    <div className="dashboard-page">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">
          <div className="dashboard-logo-mark">M</div>

          <div>
            <h2>MEDIGUIDE</h2>
            <span>Patient Portal</span>
          </div>
        </div>

        <div className="dashboard-role">
          <span>●</span> PATIENT
        </div>

        <nav className="dashboard-nav">
          <button onClick={() => navigate("/patient/dashboard")}>
            <span>⌂</span>
            Overview
          </button>

          <button onClick={() => navigate("/patient/profile")}>
            <span>◉</span>
            My Profile
          </button>

          <button>
            <span>✚</span>
            Symptom Checker
          </button>

          <button
            className="active"
            onClick={() => navigate("/patient/appointments")}
          >
            <span>▣</span>
            Appointments
          </button>

          <button>
            <span>▤</span>
            Medical History
          </button>

          <button>
            <span>☑</span>
            Diagnoses & Prescriptions
          </button>

          <button>
            <span>◌</span>
            Consultations
          </button>

          <button>
            <span>▧</span>
            Medical Records
          </button>

          <button>
            <span>🔔</span>
            Notifications
          </button>

          <button>
            <span>⚙</span>
            Settings
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">APPOINTMENTS</p>

            <h1>Appointment Details</h1>

            <p className="dashboard-subtitle">
              View the details and status of your appointment.
            </p>
          </div>

          <div className="admin-profile">
            <div className="admin-avatar">P</div>

            <div>
              <strong>Patient</strong>
              <span>Patient Account</span>
            </div>
          </div>
        </header>

        <div className="appointment-details-page">
          {/* Back */}
          <button
            className="back-button"
            onClick={() => navigate("/patient/appointments")}
          >
            ← Back to Appointments
          </button>

          {error && (
            <div className="form-alert error">
              {error}
            </div>
          )}

          {success && (
            <div className="form-alert success">
              {success}
            </div>
          )}

          {/* Appointment Header */}
          <section className="appointment-details-card">
            <div className="appointment-details-header">
              <div>
                <p className="details-label">APPOINTMENT STATUS</p>

                <span
                  className={`appointment-status ${getStatusClass(
                    appointment.status
                  )}`}
                >
                  {getStatusLabel(appointment.status)}
                </span>
              </div>

              {canCancel && (
                <button
                  className="cancel-appointment-btn"
                  onClick={handleCancel}
                  disabled={cancelling}
                >
                  {cancelling
                    ? "Cancelling..."
                    : "Cancel Appointment"}
                </button>
              )}
            </div>

            <div className="appointment-details-divider" />

            {/* Doctor */}
            <div className="doctor-details-section">
              <div className="doctor-large-avatar">
                {doctor?.firstName?.charAt(0)}
                {doctor?.lastName?.charAt(0)}
              </div>

              <div>
                <p className="details-label">DOCTOR</p>

                <h2>
                  Dr. {doctor?.firstName} {doctor?.lastName}
                </h2>

                <p className="doctor-specialization">
                  {doctor?.doctorProfile?.specialization ||
                    "Medical Doctor"}
                </p>

                {doctor?.doctorProfile?.qualification && (
                  <p className="doctor-qualification">
                    {doctor.doctorProfile.qualification}
                  </p>
                )}

                {doctor?.email && (
                  <p className="doctor-email">
                    {doctor.email}
                  </p>
                )}
              </div>
            </div>
          </section>

          <div className="appointment-details-grid">
            {/* Date & Time */}
            <section className="appointment-details-card">
              <div className="card-heading">
                <h2>Date & Time</h2>
              </div>

              <div className="detail-row">
                <span className="detail-icon">📅</span>

                <div>
                  <span className="detail-row-label">Date</span>
                  <strong>
                    {formatDate(appointment.scheduledAt)}
                  </strong>
                </div>
              </div>

              <div className="detail-row">
                <span className="detail-icon">🕐</span>

                <div>
                  <span className="detail-row-label">Time</span>
                  <strong>
                    {formatTime(appointment.scheduledAt)}
                  </strong>
                </div>
              </div>
            </section>

            {/* Appointment Information */}
            <section className="appointment-details-card">
              <div className="card-heading">
                <h2>Appointment Information</h2>
              </div>

              <div className="detail-row">
                <div>
                  <span className="detail-row-label">
                    Appointment ID
                  </span>

                  <strong className="appointment-id">
                    {appointment.id}
                  </strong>
                </div>
              </div>

              <div className="detail-row">
                <div>
                  <span className="detail-row-label">
                    Requested On
                  </span>

                  <strong>
                    {formatCreatedDate(appointment.createdAt)}
                  </strong>
                </div>
              </div>
            </section>

            {/* Reason */}
            <section className="appointment-details-card">
              <div className="card-heading">
                <h2>Reason for Appointment</h2>
              </div>

              <p className="details-text">
                {appointment.reason ||
                  "No reason provided."}
              </p>
            </section>

            {/* Notes */}
            <section className="appointment-details-card">
              <div className="card-heading">
                <h2>Additional Notes</h2>
              </div>

              <p className="details-text">
                {appointment.notes ||
                  "No additional notes were provided."}
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PatientAppointmentDetails;
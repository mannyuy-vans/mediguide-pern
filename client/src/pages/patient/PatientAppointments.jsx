import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";

const API_BASE_URL = "http://localhost:5000/api";

function PatientAppointments() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `${API_BASE_URL}/patient/appointments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load appointments."
        );
      }

      setAppointments(data.appointments || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmed) return;

    try {
      setCancellingId(appointmentId);
      setError("");

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

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to cancel appointment."
        );
      }

      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === appointmentId
            ? {
                ...appointment,
                status: "CANCELLED",
              }
            : appointment
        )
      );
    } catch (err) {
      setError(err.message || "Failed to cancel appointment.");
    } finally {
      setCancellingId(null);
    }
  };

  const filteredAppointments = useMemo(() => {
    if (filter === "ALL") {
      return appointments;
    }

    return appointments.filter(
      (appointment) => appointment.status === filter
    );
  }, [appointments, filter]);

  const counts = useMemo(() => {
    return {
      all: appointments.length,
      pending: appointments.filter(
        (appointment) => appointment.status === "PENDING"
      ).length,
      confirmed: appointments.filter(
        (appointment) => appointment.status === "CONFIRMED"
      ).length,
      completed: appointments.filter(
        (appointment) => appointment.status === "COMPLETED"
      ).length,
    };
  }, [appointments]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "status-badge confirmed";

      case "PENDING":
        return "status-badge pending";

      case "COMPLETED":
        return "status-badge completed";

      case "CANCELLED":
        return "status-badge cancelled";

      case "REJECTED":
        return "status-badge rejected";

      default:
        return "status-badge";
    }
  };

  return (
    <div className="dashboard-page">
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">
          <div className="logo-mark">M</div>

          <div>
            <h2>MEDIGUIDE</h2>
            <span>Patient Portal</span>
          </div>
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
            <span>●</span>
            Notifications
          </button>

          <button>
            <span>⚙</span>
            Settings
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <span className="dashboard-eyebrow">
              PATIENT PORTAL
            </span>

            <h1>My Appointments</h1>

            <p>
              Manage your medical appointments and consultation requests.
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

        {/* STATS */}
        <section className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">▣</div>

            <div>
              <span>Total Appointments</span>
              <strong>{counts.all}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">◷</div>

            <div>
              <span>Pending</span>
              <strong>{counts.pending}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✓</div>

            <div>
              <span>Confirmed</span>
              <strong>{counts.confirmed}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">★</div>

            <div>
              <span>Completed</span>
              <strong>{counts.completed}</strong>
            </div>
          </div>
        </section>

        {/* APPOINTMENTS */}
        <section className="dashboard-card appointments-card">
          <div className="card-heading">
            <div>
              <h2>Appointment History</h2>
              <p>
                View and manage your consultation appointments.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={() => navigate("/patient/appointments/book")}
            >
              + Book Appointment
            </button>
          </div>

          {/* FILTERS */}
          <div className="appointment-filters">
            <button
              className={filter === "ALL" ? "active" : ""}
              onClick={() => setFilter("ALL")}
            >
              All
            </button>

            <button
              className={filter === "PENDING" ? "active" : ""}
              onClick={() => setFilter("PENDING")}
            >
              Pending
            </button>

            <button
              className={filter === "CONFIRMED" ? "active" : ""}
              onClick={() => setFilter("CONFIRMED")}
            >
              Confirmed
            </button>

            <button
              className={filter === "COMPLETED" ? "active" : ""}
              onClick={() => setFilter("COMPLETED")}
            >
              Completed
            </button>

            <button
              className={filter === "CANCELLED" ? "active" : ""}
              onClick={() => setFilter("CANCELLED")}
            >
              Cancelled
            </button>
          </div>

          {error && (
            <div className="dashboard-error">
              {error}
            </div>
          )}

          {loading ? (
            <div className="empty-state">
              <div className="loading-spinner"></div>
              <p>Loading your appointments...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">▣</div>

              <h3>No appointments found</h3>

              <p>
                You currently have no appointments in this category.
              </p>

              <button
                className="primary-button"
                onClick={() =>
                  navigate("/patient/appointments/book")
                }
              >
                Book an Appointment
              </button>
            </div>
          ) : (
            <div className="appointments-list">
              {filteredAppointments.map((appointment) => (
                <div
                  className="appointment-item"
                  key={appointment.id}
                >
                  <div className="appointment-date">
                    <strong>
                      {new Date(
                        appointment.scheduledAt
                      ).getDate()}
                    </strong>

                    <span>
                      {new Date(
                        appointment.scheduledAt
                      ).toLocaleDateString("en-US", {
                        month: "short",
                      })}
                    </span>
                  </div>

                  <div className="appointment-info">
                    <div className="appointment-title">
                      <h3>
                        Dr.{" "}
                        {appointment.doctor?.firstName}{" "}
                        {appointment.doctor?.lastName}
                      </h3>

                      <span
                        className={getStatusClass(
                          appointment.status
                        )}
                      >
                        {appointment.status}
                      </span>
                    </div>

                    <p>
                      {appointment.doctor?.doctorProfile
                        ?.specialization ||
                        "Medical Consultation"}
                    </p>

                    <div className="appointment-meta">
                      <span>
                        📅{" "}
                        {formatDate(
                          appointment.scheduledAt
                        )}
                      </span>

                      <span>
                        🕐{" "}
                        {formatTime(
                          appointment.scheduledAt
                        )}
                      </span>
                    </div>

                    {appointment.reason && (
                      <p className="appointment-reason">
                        <strong>Reason:</strong>{" "}
                        {appointment.reason}
                      </p>
                    )}
                  </div>

                  <div className="appointment-actions">
                    <button
                      className="secondary-button"
                      onClick={() =>
                        navigate(
                          `/patient/appointments/${appointment.id}`
                        )
                      }
                    >
                      View Details
                    </button>

                    {(appointment.status === "PENDING" ||
                      appointment.status === "CONFIRMED") && (
                      <button
                        className="danger-button"
                        disabled={
                          cancellingId === appointment.id
                        }
                        onClick={() =>
                          handleCancel(appointment.id)
                        }
                      >
                        {cancellingId === appointment.id
                          ? "Cancelling..."
                          : "Cancel"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default PatientAppointments;
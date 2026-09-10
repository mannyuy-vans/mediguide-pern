import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function DoctorAppointments() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const [profileImage] = useState(
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
  // FETCH APPOINTMENTS
  // ==============================

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("accessToken");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/doctor/appointments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load appointments"
        );
      }

      setAppointments(data.appointments || []);
    } catch (error) {
      console.error("Appointments error:", error);
      setError(error.message || "Unable to load appointments");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // UPDATE APPOINTMENT STATUS
  // ==============================

  const updateStatus = async (appointmentId, status) => {
    try {
      setUpdatingId(appointmentId);
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

      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === appointmentId
            ? {
                ...appointment,
                status: data.appointment.status,
              }
            : appointment
        )
      );
    } catch (error) {
      console.error("Status update error:", error);
      setError(
        error.message || "Unable to update appointment"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ==============================
  // FORMAT DATE
  // ==============================

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // ==============================
  // FORMAT TIME
  // ==============================

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // ==============================
  // PATIENT NAME
  // ==============================

  const getPatientName = (appointment) => {
    if (!appointment.patient) {
      return "Unknown Patient";
    }

    return `${appointment.patient.firstName || ""} ${
      appointment.patient.lastName || ""
    }`.trim();
  };

  // ==============================
  // LOAD
  // ==============================

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ==============================
  // PAGE
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

            <h1>
              Appointments
            </h1>

            <p>
              Manage and keep track of your patient
              appointments.
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
                  {user.firstName
                    ?.charAt(0)
                    ?.toUpperCase() || "D"}
                </span>
              )}

            </label>

            <div>

              <strong>
                Dr.{" "}
                {user.firstName || "Doctor"}{" "}
                {user.lastName || ""}
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

          <div className="stat-card">

            <div className="stat-icon">
              ◷
            </div>

            <div>
              <span>
                Total Appointments
              </span>

              <strong>
                {appointments.length}
              </strong>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              ◷
            </div>

            <div>
              <span>
                Pending
              </span>

              <strong>
                {
                  appointments.filter(
                    (appointment) =>
                      appointment.status === "PENDING"
                  ).length
                }
              </strong>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              ✓
            </div>

            <div>
              <span>
                Confirmed
              </span>

              <strong>
                {
                  appointments.filter(
                    (appointment) =>
                      appointment.status === "CONFIRMED"
                  ).length
                }
              </strong>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              ♡
            </div>

            <div>
              <span>
                Completed
              </span>

              <strong>
                {
                  appointments.filter(
                    (appointment) =>
                      appointment.status === "COMPLETED"
                  ).length
                }
              </strong>
            </div>

          </div>

        </section>

        {/* ==========================
            APPOINTMENTS CARD
        =========================== */}

        <section className="dashboard-card appointments-page-card">

          <div className="card-heading">

            <div>

              <p className="dashboard-eyebrow">
                SCHEDULE
              </p>

              <h2>
                Patient Appointments
              </h2>

            </div>

            <button
              className="primary-dashboard-button"
              onClick={fetchAppointments}
            >
              Refresh
            </button>

          </div>

          {/* ERROR */}

          {error && (
            <div className="appointment-error">
              {error}
            </div>
          )}

          {/* LOADING */}

          {loading ? (
            <div className="empty-state">

              <div className="empty-icon">
                ◷
              </div>

              <h3>
                Loading appointments...
              </h3>

              <p>
                Please wait while we retrieve
                your appointments.
              </p>

            </div>

          ) : appointments.length === 0 ? (

            /* EMPTY */

            <div className="empty-state">

              <div className="empty-icon">
                ◷
              </div>

              <h3>
                No appointments yet
              </h3>

              <p>
                Your patient appointments will
                appear here.
              </p>

            </div>

          ) : (

            /* TABLE */

            <div className="appointments-table-wrapper">

              <table className="appointments-table">

                <thead>

                  <tr>

                    <th>
                      Patient
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Time
                    </th>

                    <th>
                      Reason
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {appointments.map(
                    (appointment) => (

                      <tr key={appointment.id}>

                        {/* PATIENT */}

                        <td>

                          <div className="appointment-patient">

                            <div className="appointment-patient-avatar">
                              {appointment.patient?.firstName
                                ?.charAt(0)
                                ?.toUpperCase() || "P"}
                            </div>

                            <div>

                              <strong>
                                {getPatientName(
                                  appointment
                                )}
                              </strong>

                              <span>
                                {
                                  appointment.patient
                                    ?.email ||
                                  "No email"
                                }
                              </span>

                            </div>

                          </div>

                        </td>

                        {/* DATE */}

                        <td>
                          <span className="appointment-date">
                            {formatDate(
                              appointment.scheduledAt
                            )}
                          </span>
                        </td>

                        {/* TIME */}

                        <td>
                          <span className="appointment-time">
                            {formatTime(
                              appointment.scheduledAt
                            )}
                          </span>
                        </td>

                        {/* REASON */}

                        <td>

                          <span className="appointment-reason">

                            {appointment.reason ||
                              "General consultation"}

                          </span>

                        </td>

                        {/* STATUS */}

                        <td>

                          <span
                            className={`appointment-status status-${appointment.status.toLowerCase()}`}
                          >
                            {appointment.status}
                          </span>

                        </td>

                        {/* ACTIONS */}

                        <td>

                          <div className="appointment-actions">

                            {appointment.status ===
                              "PENDING" && (
                              <>
                                <button
                                  className="appointment-confirm"
                                  disabled={
                                    updatingId ===
                                    appointment.id
                                  }
                                  onClick={() =>
                                    updateStatus(
                                      appointment.id,
                                      "CONFIRMED"
                                    )
                                  }
                                >
                                  Confirm
                                </button>

                                <button
                                  className="appointment-reject"
                                  disabled={
                                    updatingId ===
                                    appointment.id
                                  }
                                  onClick={() =>
                                    updateStatus(
                                      appointment.id,
                                      "REJECTED"
                                    )
                                  }
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {appointment.status ===
                              "CONFIRMED" && (
                              <button
                                className="appointment-complete"
                                disabled={
                                  updatingId ===
                                  appointment.id
                                }
                                onClick={() =>
                                  updateStatus(
                                    appointment.id,
                                    "COMPLETED"
                                  )
                                }
                              >
                                Complete
                              </button>
                            )}

                            <button
                              className="appointment-view"
                              onClick={() =>
                                navigate(
                                  `/doctor/appointments/${appointment.id}`
                                )
                              }
                            >
                              View
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default DoctorAppointments;
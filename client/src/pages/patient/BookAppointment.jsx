import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";

const API_BASE_URL = "http://localhost:5000/api";

function BookAppointment() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    doctorId: "",
    date: "",
    time: "",
    reason: "",
    notes: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);
      setError("");

      const token = localStorage.getItem("accessToken");

      const response = await fetch(`${API_BASE_URL}/patient/doctors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load doctors.");
      }

      setDoctors(data.doctors || []);
    } catch (err) {
      setError(err.message || "Unable to load doctors.");
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.doctorId) {
      setError("Please select a doctor.");
      return;
    }

    if (!formData.date || !formData.time) {
      setError("Please select an appointment date and time.");
      return;
    }

    if (!formData.reason.trim()) {
      setError("Please enter the reason for your appointment.");
      return;
    }

    const scheduledAt = `${formData.date}T${formData.time}`;

    const selectedDate = new Date(scheduledAt);
    const now = new Date();

    if (selectedDate <= now) {
      setError("Please select a future date and time.");
      return;
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem("accessToken");

      const response = await fetch(`${API_BASE_URL}/patient/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId: formData.doctorId,
          scheduledAt,
          reason: formData.reason.trim(),
          notes: formData.notes.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit appointment request."
        );
      }

      setSuccess("Appointment request submitted successfully.");

      setFormData({
        doctorId: "",
        date: "",
        time: "",
        reason: "",
        notes: "",
      });

      setTimeout(() => {
        navigate("/patient/appointments");
      }, 1200);
    } catch (err) {
      setError(
        err.message || "Something went wrong while booking the appointment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const selectedDoctor = doctors.find(
    (doctor) => doctor.id === formData.doctorId
  );

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

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">APPOINTMENTS</p>
            <h1>Book an Appointment</h1>
            <p className="dashboard-subtitle">
              Schedule a consultation with one of our doctors.
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

        <div className="booking-page">
          <div className="booking-card">
            <div className="card-heading">
              <div>
                <h2>Appointment Details</h2>
                <p>
                  Choose your preferred doctor, date and consultation time.
                </p>
              </div>
            </div>

            {error && <div className="form-alert error">{error}</div>}

            {success && (
              <div className="form-alert success">{success}</div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Doctor */}
              <div className="form-group">
                <label htmlFor="doctorId">Select Doctor *</label>

                {loadingDoctors ? (
                  <div className="form-loading">Loading doctors...</div>
                ) : doctors.length === 0 ? (
                  <div className="form-alert error">
                    No doctors are currently available.
                  </div>
                ) : (
                  <select
                    id="doctorId"
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choose a doctor</option>

                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        Dr. {doctor.firstName} {doctor.lastName}
                        {doctor.doctorProfile?.specialization
                          ? ` — ${doctor.doctorProfile.specialization}`
                          : ""}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Selected Doctor */}
              {selectedDoctor && (
                <div className="selected-doctor">
                  <div className="selected-doctor-avatar">
                    {selectedDoctor.firstName?.charAt(0)}
                    {selectedDoctor.lastName?.charAt(0)}
                  </div>

                  <div>
                    <h3>
                      Dr. {selectedDoctor.firstName}{" "}
                      {selectedDoctor.lastName}
                    </h3>

                    <p>
                      {selectedDoctor.doctorProfile?.specialization ||
                        "Medical Doctor"}
                    </p>

                    {selectedDoctor.doctorProfile?.qualification && (
                      <small>
                        {selectedDoctor.doctorProfile.qualification}
                      </small>
                    )}
                  </div>
                </div>
              )}

              <div className="booking-form-grid">
                {/* Date */}
                <div className="form-group">
                  <label htmlFor="date">Appointment Date *</label>

                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                {/* Time */}
                <div className="form-group">
                  <label htmlFor="time">Appointment Time *</label>

                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Reason */}
              <div className="form-group">
                <label htmlFor="reason">Reason for Appointment *</label>

                <input
                  type="text"
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="e.g. Headache and general consultation"
                  maxLength={200}
                  required
                />
              </div>

              {/* Notes */}
              <div className="form-group">
                <label htmlFor="notes">
                  Additional Notes <span>(Optional)</span>
                </label>

                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Describe any symptoms or additional information the doctor should know..."
                  rows="5"
                  maxLength={1000}
                />

                <small className="field-hint">
                  {formData.notes.length}/1000 characters
                </small>
              </div>

              {/* Actions */}
              <div className="booking-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => navigate("/patient/appointments")}
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={submitting || loadingDoctors}
                >
                  {submitting ? "Submitting..." : "Request Appointment"}
                </button>
              </div>
            </form>
          </div>

          {/* Information Card */}
          <div className="booking-info-card">
            <div className="info-icon">ℹ</div>

            <h3>Before you book</h3>

            <ul>
              <li>Choose a doctor based on your healthcare needs.</li>
              <li>Select a convenient future date and time.</li>
              <li>Provide a clear reason for your consultation.</li>
              <li>
                Your appointment will initially be marked as{" "}
                <strong>Pending</strong>.
              </li>
              <li>
                The doctor can confirm, reject or update the appointment
                status.
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BookAppointment;
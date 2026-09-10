import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../App.css";

function DoctorPatientDetails() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/doctor/patients/${patientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load patient"
          );
        }

        setPatient(data.patient);
      } catch (err) {
        console.error("Patient details error:", err);
        setError(
          err.message || "Unable to load patient details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [patientId, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("doctorProfileImage");

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <main className="dashboard-main">
          <div className="empty-state">
            <div className="empty-icon">◷</div>
            <h3>Loading patient...</h3>
            <p>
              Please wait while we retrieve the
              patient's information.
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <main className="dashboard-main">
          <div className="empty-state">
            <div className="empty-icon">!</div>
            <h3>Unable to load patient</h3>
            <p>{error}</p>

            <button
              className="primary-dashboard-button"
              onClick={() =>
                navigate("/doctor/patients")
              }
            >
              Back to Patients
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* SIDEBAR */}

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
            className="active"
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

      {/* MAIN CONTENT */}

      <main className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>
            <p className="dashboard-eyebrow">
              PATIENT MANAGEMENT
            </p>

            <h1>
              Patient Details
            </h1>

            <p>
              View and manage patient information.
            </p>
          </div>

          <button
            className="primary-dashboard-button"
            onClick={() =>
              navigate("/doctor/patients")
            }
          >
            ← Back to Patients
          </button>

        </header>

        {/* PATIENT PROFILE */}

        <section className="dashboard-card">

          <div className="patient-profile-header">

            <div className="patient-large-avatar">
              {patient?.firstName
                ?.charAt(0)
                ?.toUpperCase() || "P"}
            </div>

            <div>
              <p className="dashboard-eyebrow">
                PATIENT
              </p>

              <h2>
                {patient?.firstName}{" "}
                {patient?.lastName}
              </h2>

              <p>
                {patient?.email}
              </p>
            </div>

          </div>

          {/* BASIC INFORMATION */}

          <div className="patient-details-section">

            <p className="dashboard-eyebrow">
              BASIC INFORMATION
            </p>

            <div className="patient-details-grid">

              <div className="patient-detail-item">
                <span>First Name</span>
                <strong>
                  {patient?.firstName || "Not provided"}
                </strong>
              </div>

              <div className="patient-detail-item">
                <span>Last Name</span>
                <strong>
                  {patient?.lastName || "Not provided"}
                </strong>
              </div>

              <div className="patient-detail-item">
                <span>Email</span>
                <strong>
                  {patient?.email || "Not provided"}
                </strong>
              </div>

              <div className="patient-detail-item">
                <span>Phone</span>
                <strong>
                  {patient?.patientProfile?.phone ||
                    "Not provided"}
                </strong>
              </div>

              <div className="patient-detail-item">
                <span>Date of Birth</span>
                <strong>
                  {patient?.patientProfile?.dateOfBirth
                    ? new Date(
                        patient.patientProfile.dateOfBirth
                      ).toLocaleDateString()
                    : "Not provided"}
                </strong>
              </div>

              <div className="patient-detail-item">
                <span>Gender</span>
                <strong>
                  {patient?.patientProfile?.gender ||
                    "Not provided"}
                </strong>
              </div>

              <div className="patient-detail-item">
                <span>Blood Group</span>
                <strong>
                  {patient?.patientProfile?.bloodGroup ||
                    "Not provided"}
                </strong>
              </div>

              <div className="patient-detail-item">
                <span>Address</span>
                <strong>
                  {patient?.patientProfile?.address ||
                    "Not provided"}
                </strong>
              </div>

            </div>

          </div>

          {/* ACCOUNT INFORMATION */}

          <div className="patient-details-section">

            <p className="dashboard-eyebrow">
              ACCOUNT INFORMATION
            </p>

            <div className="patient-details-grid">

              <div className="patient-detail-item">
                <span>Patient ID</span>
                <strong>
                  {patient?.id}
                </strong>
              </div>

              <div className="patient-detail-item">
                <span>Account Created</span>
                <strong>
                  {patient?.createdAt
                    ? new Date(
                        patient.createdAt
                      ).toLocaleDateString()
                    : "Not available"}
                </strong>
              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default DoctorPatientDetails;
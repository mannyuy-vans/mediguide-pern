import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PatientProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/patient/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load profile"
          );
        }

        setProfile(data.patient);

        if (data.patient.patientProfile) {
          const patientProfile =
            data.patient.patientProfile;

          setFormData({
            dateOfBirth: patientProfile.dateOfBirth
              ? patientProfile.dateOfBirth.split("T")[0]
              : "",
            gender: patientProfile.gender || "",
            bloodGroup: patientProfile.bloodGroup || "",
            phone: patientProfile.phone || "",
            address: patientProfile.address || "",
          });
        }
      } catch (err) {
        console.error("PROFILE FETCH ERROR:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    } else {
      setError("You are not authenticated.");
      setLoading(false);
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/patient/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update profile"
        );
      }

      setMessage("Profile updated successfully.");

      setProfile((previous) => ({
        ...previous,
        patientProfile: data.patientProfile,
      }));
    } catch (err) {
      console.error("PROFILE UPDATE ERROR:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <main className="dashboard-main">
          <p>Loading your profile...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* SIDEBAR */}
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
            onClick={() =>
              navigate("/patient/dashboard")
            }
          >
            <span>▦</span>
            Overview
          </button>

          <button className="active">
            <span>♙</span>
            My Profile
          </button>

          <button
            onClick={() =>
              navigate("/patient/symptom-checker")
            }
          >
            <span>♧</span>
            Symptom Checker
          </button>

          <button
            onClick={() =>
              navigate("/patient/appointments")
            }
          >
            <span>◷</span>
            Appointments
          </button>

          <button
            onClick={() =>
              navigate("/patient/history")
            }
          >
            <span>☷</span>
            Medical History
          </button>

          <button
            onClick={() =>
              navigate("/patient/diagnoses")
            }
          >
            <span>♡</span>
            Diagnoses & Prescriptions
          </button>

          <button
            onClick={() =>
              navigate("/patient/consultations")
            }
          >
            <span>♧</span>
            Consultations
          </button>

          <button
            onClick={() =>
              navigate("/patient/records")
            }
          >
            <span>▤</span>
            Medical Records
          </button>

          <button
            onClick={() =>
              navigate("/patient/notifications")
            }
          >
            <span>♧</span>
            Notifications
          </button>

          <button
            onClick={() =>
              navigate("/patient/settings")
            }
          >
            <span>⚙</span>
            Settings
          </button>

        </nav>

      </aside>

      {/* MAIN */}
      <main className="dashboard-main">

        <header className="dashboard-header">

          <div>
            <p className="dashboard-eyebrow">
              PATIENT PORTAL
            </p>

            <h1>My Profile</h1>

            <p>
              Manage your personal and health information.
            </p>
          </div>

        </header>

        {message && (
          <div className="profile-success">
            {message}
          </div>
        )}

        {error && (
          <div className="profile-error">
            {error}
          </div>
        )}

        <section className="dashboard-card">

          {profile && (
            <div className="patient-basic-info">

              <div>
                <span>Name</span>
                <strong>
                  {profile.firstName}{" "}
                  {profile.lastName}
                </strong>
              </div>

              <div>
                <span>Email</span>
                <strong>
                  {profile.email}
                </strong>
              </div>

            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="profile-form-grid">

              <div className="profile-form-group">
                <label>Date of Birth</label>

                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>

              <div className="profile-form-group">
                <label>Gender</label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">
                    Select gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>

                  <option value="Prefer not to say">
                    Prefer not to say
                  </option>
                </select>
              </div>

              <div className="profile-form-group">
                <label>Blood Group</label>

                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                >
                  <option value="">
                    Select blood group
                  </option>

                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="Unknown">
                    Unknown
                  </option>
                </select>
              </div>

              <div className="profile-form-group">
                <label>Phone Number</label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="profile-form-group profile-form-full">
                <label>Address</label>

                <textarea
                  name="address"
                  rows="3"
                  placeholder="Enter your residential address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

            </div>

            <button
              type="submit"
              className="primary-dashboard-button"
              disabled={saving}
              style={{ marginTop: "25px" }}
            >
              {saving
                ? "Saving..."
                : "Save Profile"}
            </button>

          </form>

        </section>

      </main>
    </div>
  );
}

export default PatientProfile;
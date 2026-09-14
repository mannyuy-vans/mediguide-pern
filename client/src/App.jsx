import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import PatientDashboard from "./pages/PatientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";

import Home from "./pages/Home";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import Features from "./pages/Features";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DoctorPatientDetails from "./pages/DoctorPatientDetails";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorAppointmentDetails from "./pages/DoctorAppointmentDetails";
import PatientProfile from "./pages/PatientProfile";
import PatientAppointments from "./pages/patient/PatientAppointments";
import BookAppointment from "./pages/patient/BookAppointment";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/features" element={<Features />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/patient/dashboard"
            element={<PatientDashboard />}
          />
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />
          <Route
            path="/doctor/dashboard"
            element={<DoctorDashboard />}
          />
          <Route
            path="/doctor/patients/:patientId"
            element={<DoctorPatientDetails />}
          />
          <Route
            path="/doctor/appointments"
            element={<DoctorAppointments />}
          />
          <Route
            path="/doctor/appointments/:appointmentId"
            element={<DoctorAppointmentDetails />}
          />
          <Route
            path="/patient/profile"
            element={<PatientProfile />}
          />
          <Route
            path="/patient/appointments"
            element={<PatientAppointments />}
          />
          <Route
            path="/patient/appointments/book"
            element={<BookAppointment />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
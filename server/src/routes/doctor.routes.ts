import { Router } from "express";

import {
  getDoctorProfile,
  getMyPatients,
  getPatientById,
  getDoctorAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  createAppointment,
} from "../controllers/doctor.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

// ==========================================
// DOCTOR PROFILE
// ==========================================

router.get(
  "/profile",
  authenticate,
  requireRole("DOCTOR"),
  getDoctorProfile
);

// ==========================================
// PATIENTS
// ==========================================

router.get(
  "/patients",
  authenticate,
  requireRole("DOCTOR"),
  getMyPatients
);

router.get(
  "/patients/:patientId",
  authenticate,
  requireRole("DOCTOR"),
  getPatientById
);

// ==========================================
// APPOINTMENTS
// ==========================================

router.get(
  "/appointments",
  authenticate,
  requireRole("DOCTOR"),
  getDoctorAppointments
);

router.post(
  "/appointments",
  authenticate,
  requireRole("DOCTOR"),
  createAppointment
);

router.get(
  "/appointments/:appointmentId",
  authenticate,
  requireRole("DOCTOR"),
  getAppointmentById
);

router.patch(
  "/appointments/:appointmentId/status",
  authenticate,
  requireRole("DOCTOR"),
  updateAppointmentStatus
);

export default router;
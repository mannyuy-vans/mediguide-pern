import { Router } from "express";

import {
  getPatientProfile,
  updatePatientProfile,
  getDoctors,
  getPatientAppointments,
  createPatientAppointment,
  getPatientAppointmentById,
  cancelPatientAppointment,
} from "../controllers/patient.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

// =========================
// PATIENT PROFILE
// =========================

router.get(
  "/profile",
  authenticate,
  requireRole("PATIENT"),
  getPatientProfile
);

router.put(
  "/profile",
  authenticate,
  requireRole("PATIENT"),
  updatePatientProfile
);

// =========================
// DOCTORS
// =========================

router.get(
  "/doctors",
  authenticate,
  requireRole("PATIENT"),
  getDoctors
);

// =========================
// PATIENT APPOINTMENTS
// =========================

router.get(
  "/appointments",
  authenticate,
  requireRole("PATIENT"),
  getPatientAppointments
);

router.post(
  "/appointments",
  authenticate,
  requireRole("PATIENT"),
  createPatientAppointment
);

router.get(
  "/appointments/:appointmentId",
  authenticate,
  requireRole("PATIENT"),
  getPatientAppointmentById
);

router.patch(
  "/appointments/:appointmentId/cancel",
  authenticate,
  requireRole("PATIENT"),
  cancelPatientAppointment
);

export default router;
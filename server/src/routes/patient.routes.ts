import { Router } from "express";

import {
  getPatientProfile,
  updatePatientProfile,
} from "../controllers/patient.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

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

export default router;
import { Router } from "express";
import { getPatientProfile } from "../controllers/patient.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

router.get(
  "/profile",
  authenticate,
  requireRole("PATIENT"),
  getPatientProfile
);

export default router;
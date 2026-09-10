import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

import {
  createDoctor,
  getAllDoctors,
} from "../controllers/admin.controllers.js";

const router = Router();

/* ------------------------------
   DOCTOR MANAGEMENT
------------------------------ */

// Create Doctor
router.post(
  "/doctors",
  authenticate,
  requireRole("ADMIN"),
  createDoctor
);

// Get all Doctors
router.get(
  "/doctors",
  authenticate,
  requireRole("ADMIN"),
  getAllDoctors
);

export default router;
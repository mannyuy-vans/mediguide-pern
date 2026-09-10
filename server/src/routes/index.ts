import { Router } from "express";

import authRoutes from "./auth.routes.js";
import patientRoutes from "./patient.routes.js";
import adminRoutes from "./admin.routes.js";
import doctorRoutes from "./doctor.routes.js";

const router = Router();

router.use("/auth", authRoutes);

router.use("/patient", patientRoutes);

router.use("/admin", adminRoutes);

router.use("/doctor", doctorRoutes);

export default router;
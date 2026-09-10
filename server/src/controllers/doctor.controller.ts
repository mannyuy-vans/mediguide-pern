import { Request, Response } from "express";
import prisma from "../config/prisma.js";

// ==========================================
// GET DOCTOR PROFILE
// ==========================================

export const getDoctorProfile = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const doctor = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        authUserId: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        doctorProfile: true,
      },
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    console.error("GET DOCTOR PROFILE FAILED:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve doctor profile",
    });
  }
};

// ==========================================
// GET ALL PATIENTS
// ==========================================

export const getMyPatients = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const patients = await prisma.user.findMany({
      where: {
        role: "PATIENT",
      },

      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,

        patientProfile: {
          select: {
            dateOfBirth: true,
            gender: true,
            bloodGroup: true,
            phone: true,
            address: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error) {
    console.error("GET MY PATIENTS FAILED:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve patients",
    });
  }
};

// ==========================================
// GET SINGLE PATIENT
// ==========================================

export const getPatientById = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const patientId = String(req.params.patientId);

    if (!patientId || patientId === "undefined") {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required",
      });
    }

    const patient = await prisma.user.findFirst({
      where: {
        id: patientId,
        role: "PATIENT",
      },
      include: {
        patientProfile: true,
      },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      success: true,
      patient,
    });
  } catch (error) {
    console.error("GET PATIENT BY ID FAILED:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve patient",
    });
  }
};

// ==========================================
// GET DOCTOR APPOINTMENTS
// ==========================================

export const getDoctorAppointments = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: req.user.id,
      },

      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,

            patientProfile: {
              select: {
                phone: true,
                gender: true,
                bloodGroup: true,
              },
            },
          },
        },
      },

      orderBy: {
        scheduledAt: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error(
      "GET DOCTOR APPOINTMENTS FAILED:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve appointments",
    });
  }
};

// ==========================================
// GET SINGLE APPOINTMENT
// ==========================================

export const getAppointmentById = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const appointmentId = String(
      req.params.appointmentId
    );

    if (
      !appointmentId ||
      appointmentId === "undefined"
    ) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID is required",
      });
    }

    const appointment =
      await prisma.appointment.findFirst({
        where: {
          id: appointmentId,
          doctorId: req.user.id,
        },

        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,

              patientProfile: true,
            },
          },
        },
      });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    return res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error(
      "GET APPOINTMENT BY ID FAILED:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve appointment",
    });
  }
};

// ==========================================
// UPDATE APPOINTMENT STATUS
// ==========================================

export const updateAppointmentStatus = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const appointmentId = String(
      req.params.appointmentId
    );

    const { status, notes } = req.body;

    if (
      !appointmentId ||
      appointmentId === "undefined"
    ) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID is required",
      });
    }

    const allowedStatuses = [
      "PENDING",
      "CONFIRMED",
      "REJECTED",
      "COMPLETED",
      "CANCELLED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment status",
      });
    }

    const existingAppointment =
      await prisma.appointment.findFirst({
        where: {
          id: appointmentId,
          doctorId: req.user.id,
        },
      });

    if (!existingAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const appointment =
      await prisma.appointment.update({
        where: {
          id: appointmentId,
        },

        data: {
          status,
          ...(notes !== undefined && { notes }),
        },

        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

    return res.status(200).json({
      success: true,
      message: "Appointment status updated successfully",
      appointment,
    });
  } catch (error) {
    console.error(
      "UPDATE APPOINTMENT STATUS FAILED:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to update appointment status",
    });
  }
};
// ==========================================
// CREATE APPOINTMENT
// ==========================================

export const createAppointment = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const {
      patientId,
      scheduledAt,
      reason,
      notes,
    } = req.body;

    // Validate required fields
    if (!patientId || !scheduledAt) {
      return res.status(400).json({
        success: false,
        message: "Patient ID and appointment date/time are required",
      });
    }

    // Verify patient exists
    const patient = await prisma.user.findFirst({
      where: {
        id: String(patientId),
        role: "PATIENT",
      },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Make sure the appointment date is valid
    const appointmentDate = new Date(scheduledAt);

    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment date/time",
      });
    }

    // Prevent appointments in the past
    if (appointmentDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Appointment date/time must be in the future",
      });
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId: String(patientId),
        doctorId: req.user.id,
        scheduledAt: appointmentDate,
        reason: reason || null,
        notes: notes || null,
        status: "PENDING",
      },

      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },

        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    console.error(
      "CREATE APPOINTMENT FAILED:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to create appointment",
    });
  }
};
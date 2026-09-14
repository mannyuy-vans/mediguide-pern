import { Request, Response } from "express";
import prisma from "../config/prisma.js";

// ==========================================
// GET PATIENT PROFILE
// ==========================================

export const getPatientProfile = async (
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

    const patient = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,

        patientProfile: {
          select: {
            id: true,
            dateOfBirth: true,
            gender: true,
            bloodGroup: true,
            phone: true,
            address: true,
          },
        },
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
      message: "Patient profile retrieved successfully",
      patient,
    });
  } catch (error) {
    console.error("GET PATIENT PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve patient profile",
    });
  }
};

// ==========================================
// UPDATE PATIENT PROFILE
// ==========================================

export const updatePatientProfile = async (
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
      dateOfBirth,
      gender,
      bloodGroup,
      phone,
      address,
    } = req.body;

    const allowedGenders = [
      "Male",
      "Female",
      "Other",
      "Prefer not to say",
    ];

    if (gender && !allowedGenders.includes(gender)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gender value",
      });
    }

    const allowedBloodGroups = [
      "A+",
      "A-",
      "B+",
      "B-",
      "AB+",
      "AB-",
      "O+",
      "O-",
      "Unknown",
    ];

    if (bloodGroup && !allowedBloodGroups.includes(bloodGroup)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blood group value",
      });
    }

    let parsedDateOfBirth: Date | null | undefined;

    if (dateOfBirth) {
      parsedDateOfBirth = new Date(dateOfBirth);

      if (isNaN(parsedDateOfBirth.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid date of birth",
        });
      }
    } else {
      parsedDateOfBirth = null;
    }

    const patientProfile = await prisma.patientProfile.upsert({
      where: {
        userId: req.user.id,
      },
      update: {
        dateOfBirth: parsedDateOfBirth,
        gender: gender || null,
        bloodGroup: bloodGroup || null,
        phone: phone || null,
        address: address || null,
      },
      create: {
        userId: req.user.id,
        dateOfBirth: parsedDateOfBirth,
        gender: gender || null,
        bloodGroup: bloodGroup || null,
        phone: phone || null,
        address: address || null,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Patient profile updated successfully",
      patientProfile,
    });
  } catch (error) {
    console.error("UPDATE PATIENT PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update patient profile",
    });
  }
};

// ==========================================
// GET ALL DOCTORS
// ==========================================

export const getDoctors = async (
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

    const doctors = await prisma.user.findMany({
      where: {
        role: "DOCTOR",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,

        doctorProfile: {
          select: {
            specialization: true,
            qualification: true,
            experience: true,
            bio: true,
            licenseNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    console.error("GET DOCTORS FAILED:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve doctors",
    });
  }
};

// ==========================================
// GET PATIENT APPOINTMENTS
// ==========================================

export const getPatientAppointments = async (
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
        patientId: req.user.id,
      },

      include: {
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,

            doctorProfile: {
              select: {
                specialization: true,
                qualification: true,
                experience: true,
                bio: true,
                licenseNumber: true,
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
      "GET PATIENT APPOINTMENTS FAILED:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve appointments",
    });
  }
};

// ==========================================
// CREATE PATIENT APPOINTMENT REQUEST
// ==========================================

export const createPatientAppointment = async (
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
      doctorId,
      scheduledAt,
      reason,
      notes,
    } = req.body;

    // Validate required fields
    if (!doctorId || !scheduledAt) {
      return res.status(400).json({
        success: false,
        message:
          "Doctor ID and appointment date/time are required",
      });
    }

    // Verify doctor exists
    const doctor = await prisma.user.findFirst({
      where: {
        id: String(doctorId),
        role: "DOCTOR",
      },

      include: {
        doctorProfile: true,
      },
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Validate appointment date
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
        message:
          "Appointment date/time must be in the future",
      });
    }

    // Prevent the same patient from requesting
    // the exact same appointment time with the same doctor
    const existingAppointment =
      await prisma.appointment.findFirst({
        where: {
          patientId: req.user.id,
          doctorId: String(doctorId),
          scheduledAt: appointmentDate,
          status: {
            in: ["PENDING", "CONFIRMED"],
          },
        },
      });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message:
          "You already have an active appointment at this time with this doctor",
      });
    }

    // Create appointment
    const appointment =
      await prisma.appointment.create({
        data: {
          patientId: req.user.id,
          doctorId: String(doctorId),
          scheduledAt: appointmentDate,
          reason: reason || null,
          notes: notes || null,
          status: "PENDING",
        },

        include: {
          doctor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,

              doctorProfile: {
                select: {
                  specialization: true,
                  qualification: true,
                  experience: true,
                  bio: true,
                  licenseNumber: true,
                },
              },
            },
          },
        },
      });

    return res.status(201).json({
      success: true,
      message:
        "Appointment request submitted successfully",
      appointment,
    });
  } catch (error) {
    console.error(
      "CREATE PATIENT APPOINTMENT FAILED:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to create appointment",
    });
  }
};

// ==========================================
// GET SINGLE PATIENT APPOINTMENT
// ==========================================

export const getPatientAppointmentById = async (
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
          patientId: req.user.id,
        },

        include: {
          doctor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,

              doctorProfile: {
                select: {
                  specialization: true,
                  qualification: true,
                  experience: true,
                  bio: true,
                  licenseNumber: true,
                },
              },
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
      "GET PATIENT APPOINTMENT BY ID FAILED:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve appointment",
    });
  }
};

// ==========================================
// CANCEL PATIENT APPOINTMENT
// ==========================================

export const cancelPatientAppointment = async (
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
          patientId: req.user.id,
        },
      });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Only active appointments can be cancelled
    if (
      appointment.status !== "PENDING" &&
      appointment.status !== "CONFIRMED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Only pending or confirmed appointments can be cancelled",
      });
    }

    const cancelledAppointment =
      await prisma.appointment.update({
        where: {
          id: appointmentId,
        },

        data: {
          status: "CANCELLED",
        },

        include: {
          doctor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,

              doctorProfile: {
                select: {
                  specialization: true,
                  qualification: true,
                  experience: true,
                },
              },
            },
          },
        },
      });

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment: cancelledAppointment,
    });
  } catch (error) {
    console.error(
      "CANCEL PATIENT APPOINTMENT FAILED:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to cancel appointment",
    });
  }
};
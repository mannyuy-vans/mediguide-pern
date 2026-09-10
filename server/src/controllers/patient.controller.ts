import { Request, Response } from "express";
import prisma from "../config/prisma.js";

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

    // Validate gender if provided
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

    // Validate blood group if provided
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

    // Validate date if provided
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
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
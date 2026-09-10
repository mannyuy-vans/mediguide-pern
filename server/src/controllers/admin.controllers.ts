import { Request, Response } from "express";
import supabaseAdmin from "../config/supabaseAdmin.js";
import prisma from "../config/prisma.js";

/* =========================================
   CREATE DOCTOR
========================================= */

export const createDoctor = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
    } = req.body;

    // Validate required fields
    if (
      !email ||
      !password ||
      !firstName ||
      !lastName
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email, password, first name and last name are required",
      });
    }

    console.log(
      "Creating doctor account for:",
      email
    );

    /*
      =========================================
      1. CREATE ACCOUNT IN SUPABASE AUTH
      =========================================
    */

    const {
      data: authData,
      error: authError,
    } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      console.error(
        "Supabase doctor creation error:",
        authError
      );

      return res.status(400).json({
        success: false,
        message: authError.message,
      });
    }

    if (!authData.user) {
      return res.status(400).json({
        success: false,
        message:
          "Supabase did not return a doctor user",
      });
    }

    console.log(
      "Supabase doctor created:",
      authData.user.id
    );

    /*
      =========================================
      2. CREATE APPLICATION USER IN PRISMA
      =========================================
    */

    const doctor = await prisma.user.create({
      data: {
        authUserId: authData.user.id,
        email: authData.user.email!,
        firstName,
        lastName,
        role: "DOCTOR",
      },
    });

    console.log(
      "Doctor application profile created:",
      doctor.id
    );

    /*
      =========================================
      3. RETURN RESPONSE
      =========================================
    */

    return res.status(201).json({
      success: true,
      message: "Doctor account created successfully",
      doctor,
    });
  } catch (error) {
    console.error(
      "CREATE DOCTOR FAILED:",
      error
    );

    /*
      If Prisma creation fails after Supabase
      successfully created the account, we should
      remove the Supabase account to avoid leaving
      an incomplete doctor account behind.
    */

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while creating the doctor account",
    });
  }
};


/* =========================================
   GET ALL DOCTORS
========================================= */

export const getAllDoctors = async (
  req: Request,
  res: Response
) => {
  try {
    const doctors = await prisma.user.findMany({
      where: {
        role: "DOCTOR",
      },

      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,

        doctorProfile: true,
      },
    });

    return res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    console.error(
      "GET DOCTORS FAILED:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to retrieve doctors",
    });
  }
};
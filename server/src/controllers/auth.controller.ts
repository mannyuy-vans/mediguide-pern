import { Request, Response } from "express";
import supabase from "../config/supabase.js";
import prisma from "../config/prisma.js";

export const register = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
    } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "Email, password, first name and last name are required",
      });
    }

    console.log("Attempting Supabase registration for:", email);

    // Create account in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Supabase registration error:", error);

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (!data.user) {
      return res.status(400).json({
        success: false,
        message: "Supabase did not return a user",
      });
    }

    console.log("Supabase user created:", data.user.id);

    // Create application user
    const user = await prisma.user.create({
      data: {
        authUserId: data.user.id,
        email: data.user.email!,
        firstName,
        lastName,
        role: "PATIENT",
      },
    });

    console.log("Application user created:", user.id);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user,
      session: data.session,
    });
  } catch (error) {
    console.error("REGISTRATION FAILED:", error);

    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong during registration",
    });
  }
};
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    console.log("Attempting login for:", email);

    // Login with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Supabase login error:", error);

      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }

    if (!data.user) {
      return res.status(401).json({
        success: false,
        message: "Invalid login credentials",
      });
    }

    // Find the application user in Prisma
    const user = await prisma.user.findUnique({
      where: {
        authUserId: data.user.id,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
      session: data.session,
    });
  } catch (error) {
    console.error("LOGIN FAILED:", error);

    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong during login",
    });
  }
};
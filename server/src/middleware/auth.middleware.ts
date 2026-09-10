import { Request, Response, NextFunction } from "express";
import supabase from "../config/supabase.js";
import prisma from "../config/prisma.js";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    const {
  data: { user: authUser },
  error,
} = await supabase.auth.getUser(token);

    if (error || !authUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        authUserId: authUser.id,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("AUTHENTICATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};
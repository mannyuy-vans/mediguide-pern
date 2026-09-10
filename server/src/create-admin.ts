import "dotenv/config";
import supabaseAdmin from "./config/supabaseAdmin.js";
import prisma from "./config/prisma.js";

const createAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const firstName = process.env.ADMIN_FIRST_NAME;
    const lastName = process.env.ADMIN_LAST_NAME;

    if (!email || !password || !firstName || !lastName) {
      throw new Error(
        "ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_FIRST_NAME and ADMIN_LAST_NAME must be defined"
      );
    }

    console.log("Creating Admin account...");

    // Check whether the application user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("An application user with this email already exists.");
      console.log("Role:", existingUser.role);
      return;
    }

    // Create the Supabase Auth account
    const { data, error } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (error) {
      throw new Error(`Supabase Admin creation failed: ${error.message}`);
    }

    if (!data.user) {
      throw new Error("Supabase did not return the Admin user.");
    }

    console.log("Supabase Admin created:", data.user.id);

    // Create the application user
    const admin = await prisma.user.create({
      data: {
        authUserId: data.user.id,
        email,
        firstName,
        lastName,
        role: "ADMIN",
      },
    });

    console.log("Admin application user created:", admin.id);
    console.log("Admin account created successfully.");
  } catch (error) {
    console.error("ADMIN CREATION FAILED:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
};

createAdmin();
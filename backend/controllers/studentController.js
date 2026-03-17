import Student from "../models/Student.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const registerStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      college,
      program,
      semester,
      usn,
      github,
      password,
    } = req.body;

    // 1. Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create Student
    const newStudent = new Student({
      name,
      email,
      phone,
      college,
      program,
      semester,
      usn, // Make sure to add this if it's in your Schema
      githubLink: github, // Mapping frontend github to model githubLink
      password: hashedPassword,
    });

    await newStudent.save();

    // 4. Generate JWT Token for Auto-Login
    const token = jwt.sign({ id: newStudent._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 5. Send Response with Token
    res.status(201).json({
      success: true,
      message: "Registration Successful",
      token, // Sending the token back
      student: { name: newStudent.name, email: newStudent.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      success: true,
      token,
      student: { name: student.name, email: student.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Configure your email transporter (Replace with your actual email credentials)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your App Password (if using Gmail)
  },
});

export const sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const student = await Student.findOne({ email });

    if (!student) {
      return res
        .status(404)
        .json({ message: "No account found with that email." });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the OTP before saving to DB for security (Optional but recommended)
    const salt = await bcrypt.genSalt(10);
    student.resetPasswordOtp = await bcrypt.hash(otp, salt);
    student.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes from now
    await student.save();

    // Send the email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: student.email,
      subject: "InterConnect - Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>Hello ${student.name},</p>
          <p>You requested to reset your password. Use the following OTP to proceed. It is valid for 10 minutes.</p>
          <h1 style="color: #2563eb; letter-spacing: 5px;">${otp}</h1>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "OTP sent to your email." });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP. Try again later." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if OTP is expired
    if (student.resetPasswordExpires < Date.now()) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    // Verify OTP
    const isMatch = await bcrypt.compare(otp, student.resetPasswordOtp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(newPassword, salt);

    // Clear OTP fields
    student.resetPasswordOtp = undefined;
    student.resetPasswordExpires = undefined;
    await student.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully! You can now login.",
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const createProblem = async (req, res) => {
  try {
    const {
      title, // <-- ADD THIS
      category,
      description,
      theme,
      tags,
      ownerName,
      organization,
      department,
      contactInfo,
      problem_coordinator,
    } = req.body;

    const newProblem = new Problem({
      title, // <-- ADD THIS
      category,
      description,
      theme,
      tags: tags.split(",").map((tag) => tag.trim()),
      ownerName,
      organization,
      department,
      contactInfo,
      problem_coordinator,
      is_published: false,
    });

    await newProblem.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Problem submitted successfully. Pending admin review.",
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectToDatabase from "../db.js";
import dotenv from "dotenv";

const router = express.Router();
const JWT_SECRET = "supersecret";
//register student api
router.post("/register", async (req, res) => {
  try {
    const db = await connectToDatabase("attendanceDB");
    const students = db.collection("students");

    const { roll_no, name, password } = req.body;

    if (!roll_no || !name || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check existing
    const existing = await students.findOne({ roll_no });
    if (existing) {
      return res.status(400).json({ message: "Student already registered" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    await students.insertOne({
      roll_no,
      name,
      password: hashedPassword,
      createdAt: new Date()
    });

    res.status(201).json({ message: "Student registered successfully ✅" });
  } catch (error) {
    console.error(" Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
//login student api
router.post("/login", async (req, res) => {
  try {
    const db = await connectToDatabase("attendanceDB");
    const students = db.collection("students");

    const { roll_no, password } = req.body;

    if (!roll_no || !password) {
      return res.status(400).json({ message: "Roll no and password required" });
    }

    const student = await students.findOne({ roll_no });
    if (!student) {
      return res.status(401).json({ message: "Invalid roll number" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // generate JWT
    const token = jwt.sign(
      { roll_no: student.roll_no, id: student._id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful ✅",
      token,
      student: {
        roll_no: student.roll_no,
        name: student.name
      }
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

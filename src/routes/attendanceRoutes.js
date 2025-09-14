import express from "express";
import connectToDatabase from "../db.js";

const router = express.Router();

console.log(" attendanceRoutes.js loaded");

// Test ping (to verify routes working)
router.get("/ping", (req, res) => {
  res.send("attendanceRoutes is working ✅");
});

// POST /api/attendance/mark
router.post("/mark", async (req, res) => {
  console.log("✅ POST /api/attendance/mark hit");
  console.log("Request Body:", req.body);

  try {
    const db = await connectToDatabase("attendanceDB");
    const attendanceCollection = db.collection("attendance");

    const { cardId, name, status, time } = req.body;

    if (!cardId || !status || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newRecord = {
      cardId,
      name: name || "Unknown",
      status,
      time,
      createdAt: new Date()
    };

    const result = await attendanceCollection.insertOne(newRecord);

    res.status(201).json({
      message: "Attendance marked successfully",
      recordId: result.insertedId
    });
  } catch (error) {
    console.error(" Error in POST /api/attendance/mark:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/attendance/:cardId
router.get("/:cardId", async (req, res) => {
  console.log("✅ GET /api/attendance/:cardId hit");

  try {
    const db = await connectToDatabase("attendanceDB");
    const attendanceCollection = db.collection("attendance");

    const { cardId } = req.params;

    const records = await attendanceCollection
      .find({ cardId })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(records);
  } catch (error) {
    console.error("❌ Error in GET /attendance/:cardId:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

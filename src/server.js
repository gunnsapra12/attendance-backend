import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToDatabase from "./db.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/attendance", attendanceRoutes);
app.use("/api/student", studentRoutes);

// Test route
app.get("/test", (req, res) => {
  res.send("api is working ✅");
});

// Start server
app.listen(port, async () => {
  await connectToDatabase("attendanceDB");
  console.log(`✅ Attendance backend started at port  http://localhost:${port}`);
  console.log(`➡️ Test API:        http://localhost:${port}/test`);
  console.log(`➡️ Mark Attendance: http://localhost:${port}/api/attendance/mark`);
});

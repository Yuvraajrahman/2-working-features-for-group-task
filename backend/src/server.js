//backend/src/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { connectDB } from "./config/db.js";
import rateLimiter from "./middlewares/rateLimiter.js";

import adminRoutes from "./routes/adminRoutes.js";
import institutionRoutes from "./routes/institutionRoutes.js";
import institutionRoomRoutes from "./routes/institution/InstitutionRoomRoutes.js";
import instructorRoutes from "./routes/instructorRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import roomsRoutes from "./routes/roomsRoutes.js";
import forumContentRoutes from "./routes/forumContentRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import assessmentRoutes from "./routes/assessmentRoutes.js";
import yuvrajAnnouncementRoutes from "./routes/yuvraj_announcementRoutes.js";
import yuvrajPollingAndSurveyRoutes from "./routes/PollingAndSurveyRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// enable CORS for all origins
app.use(
  cors({
    origin: "*",
    credentials: false,
  })
);

// parse JSON bodies
app.use(express.json());

// optional rate limiting
// app.use(rateLimiter);

// simple DB‐status check
app.get("/api/db-status", (req, res) => {
  const conn = mongoose.connection;
  res.json({
    readyState: conn.readyState,
    host:       conn.host,
    name:       conn.name,
    port:       conn.port,
    isAtlas:    conn.host?.includes("mongodb.net"),
    message:    conn.readyState === 1 ? "Connected" : "Disconnected",
  });
});

// mount your routers
app.use("/api/admin", adminRoutes);

// → Institutions (plural)
app.use("/api/institutions", institutionRoutes);

// → Nested “rooms” under an institution
app.use(
  "/api/institutions/:idOrName/rooms",
  institutionRoomRoutes
);

app.use("/api/instructors", instructorRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/rooms", roomsRoutes);
app.use("/api/forum-content", forumContentRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/yuvraj/announcements", yuvrajAnnouncementRoutes);
app.use("/api/PollingAndSurvey", yuvrajPollingAndSurveyRoutes);

// connect to DB, then start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
  });
});
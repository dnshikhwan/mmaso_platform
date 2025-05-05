import { Router } from "express";
import express from "express";
import timetableController from "../controllers/timetable.controller";
import adminController from "../controllers/admin.controller";
import eventController from "../controllers/event.controller";
import studentController from "../controllers/student.controller";
import notesController from "../controllers/notes.controller";
import path from "path";
import announcementController from "../controllers/announcement.controller";

export const createRouter = () => {
  const router = Router();

  router.use("/timetable", timetableController());
  router.use("/admin", adminController());
  router.use("/event", eventController());
  router.use("/student", studentController());
  router.use("/notes", notesController());
  router.use("/announcement", announcementController());
  router.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

  return router;
};

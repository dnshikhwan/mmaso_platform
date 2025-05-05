import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  addAnnouncement,
  getAnnouncements,
  getAnnouncementsByStudent,
  markAsRead,
} from "../services/announcement.service";

const announcementController = () => {
  const router = Router();

  router.get("/mark-as-read/:id", authMiddleware, markAsRead);
  router.post("/add-announcement", authMiddleware, addAnnouncement);
  router.get("/get-announcements", authMiddleware, getAnnouncements);
  router.get(
    "/get-announcement-by-student",
    authMiddleware,
    getAnnouncementsByStudent
  );

  return router;
};

export default announcementController;

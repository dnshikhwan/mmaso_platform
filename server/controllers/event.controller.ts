import { Router } from "express";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
import {
  createEvent,
  deleteEvent,
  editEvent,
  getAllEvent,
  getEvent,
  joinEvent,
} from "../services/event.service";
import { authMiddleware } from "../middlewares/auth.middleware";

const eventController = () => {
  const router = Router();

  router.get("/get-event/:id", authMiddleware, getEvent);
  router.get("/join-event/:eventId", authMiddleware, joinEvent);
  router.put("/edit-event/:id", authMiddleware, editEvent);
  router.delete("/delete-event/:id", authMiddleware, deleteEvent);
  router.post("/create-event", authMiddleware, createEvent);
  router.get("/all-events", authMiddleware, getAllEvent);

  return router;
};

export default eventController;

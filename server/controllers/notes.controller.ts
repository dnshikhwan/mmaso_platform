import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  createNote,
  deleteNotes,
  editNote,
  getNote,
  getNotes,
} from "../services/notes.service";

const notesController = () => {
  const router = Router();

  router.get("/get-note/:id", authMiddleware, getNote);
  router.delete("/delete-note/:id", authMiddleware, deleteNotes);
  router.put("/edit-note/:id", authMiddleware, editNote);
  router.get("/all-notes", authMiddleware, getNotes);
  router.post("/create-note", authMiddleware, createNote);

  return router;
};

export default notesController;

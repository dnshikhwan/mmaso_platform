import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createNote, getNotes } from "../services/notes.service";

const notesController = () => {
    const router = Router();

    router.get("/all-notes", authMiddleware, getNotes);
    router.post("/create-note", authMiddleware, createNote);

    return router;
};

export default notesController;

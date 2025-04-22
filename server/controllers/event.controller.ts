import { Router } from "express";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
import {
    createEvent,
    deleteEvent,
    getAllEvent,
    getEvent,
} from "../services/event.service";

const eventController = () => {
    const router = Router();

    router.get("/get-event/:id", getEvent);
    router.delete("/delete-event/:id", deleteEvent);
    router.post("/create-event", upload.single("picture"), createEvent);
    router.get("/all-events", getAllEvent);

    return router;
};

export default eventController;

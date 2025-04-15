import { Router } from "express";
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
    router.post("/create-event", createEvent);
    router.get("/all-events", getAllEvent);

    return router;
};

export default eventController;

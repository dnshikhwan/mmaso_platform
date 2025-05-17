import { Router } from "express";
import {
    getAllGroups,
    getTimetable,
    getUpcomingWeekTimetable,
} from "../services/timetable.service";

const timetableController = () => {
    const router = Router();

    router.get("/groups", getAllGroups);
    router.get("/:groupCode/upcoming-week", getUpcomingWeekTimetable as any);
    router.get("/:groupCode", getTimetable as any);

    return router;
};

export default timetableController;

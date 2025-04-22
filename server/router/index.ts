import { Router } from "express";
import { testController } from "../controllers/test.controller";
import timetableController from "../controllers/timetable.controller";
import adminController from "../controllers/admin.controller";
import eventController from "../controllers/event.controller";
import studentController from "../controllers/student.controller";

export const createRouter = () => {
    const router = Router();

    router.use("/test", testController());
    router.use("/timetable", timetableController());
    router.use("/admin", adminController());
    router.use("/event", eventController());
    router.use("/student", studentController());

    return router;
};

import { Router } from "express";
import { getTimetable } from "../services/timetable.service";

const timetableController = () => {
  const router = Router();

  router.get("/", getTimetable);

  return router;
};

export default timetableController;

import { Router } from "express";
import { testController } from "../controllers/test.controller";
import authController from "../controllers/auth.controller";
import timetableController from "../controllers/timetable.controller";

export const createRouter = () => {
  const router = Router();

  router.use("/test", testController());
  router.use("/auth", authController());
  router.use("/timetable", timetableController());

  return router;
};

// src/services/timetable.service.ts

import { NextFunction, Request, Response } from "express";
import { fetchTimetable, TimetableEntry } from "../helpers/scraper.helper";
import { sendResponse } from "../helpers/response.helper";
import { APP_MESSAGE, HTTP_RESPONSE_CODE } from "../constants";

export const getTimetable = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const group = String(req.query.group || "").trim();
    if (!group) {
      return sendResponse(
        res,
        false,
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        APP_MESSAGE.missingRequiredFields
      );
    }

    const schedule: TimetableEntry[] = await fetchTimetable(group);

    return sendResponse(res, true, HTTP_RESPONSE_CODE.OK, APP_MESSAGE.success, {
      schedule,
    });
  } catch (err) {
    next(err);
  }
};

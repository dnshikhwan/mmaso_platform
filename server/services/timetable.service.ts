import { NextFunction, Request, Response } from "express";
import scrapeTimetable from "../helpers/timetableScrapper";
import { sendResponse } from "../helpers/response.helper";
import { APP_MESSAGE, HTTP_RESPONSE_CODE } from "../constants";

export const getTimetable = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    scrapeTimetable();
    return sendResponse(res, true, HTTP_RESPONSE_CODE.OK, APP_MESSAGE.success);
  } catch (err) {
    next(err);
  }
};

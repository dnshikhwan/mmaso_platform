import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { sendResponse } from "../helpers/response.helper";
import { APP_MESSAGE, HTTP_RESPONSE_CODE } from "../constants";
import { configs } from "../configs";
import { User } from "@prisma/client";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return sendResponse(
        res,
        false,
        HTTP_RESPONSE_CODE.UNAUTHORIZED,
        APP_MESSAGE.userUnauthorized
      );
    }

    const user = jwt.verify(token, configs.JWT_SECRET) as User;

    req.user = user;

    next();
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      return sendResponse(
        res,
        false,
        HTTP_RESPONSE_CODE.UNAUTHORIZED,
        APP_MESSAGE.accessTokenExpired
      );
    }
    next(err);
  }
};

import { NextFunction, Request, Response } from "express";
import argon from "argon2";
import jwt from "jsonwebtoken";
import { sendResponse } from "../helpers/response.helper";
import { APP_MESSAGE, HTTP_RESPONSE_CODE } from "../constants";
import prisma from "../prisma/prisma";
import { configs } from "../configs";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, privacy_policy } = req.body;

    if (!privacy_policy) {
      return sendResponse(
        res,
        false,
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        APP_MESSAGE.policyError
      );
    }

    if (!name || !email || !password) {
      return sendResponse(
        res,
        false,
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        APP_MESSAGE.missingRequiredFields
      );
    }

    const emailExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (emailExists) {
      return sendResponse(
        res,
        false,
        HTTP_RESPONSE_CODE.CONFLICT,
        APP_MESSAGE.emailExists
      );
    }

    const hashedPassword = await argon.hash(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return sendResponse(
      res,
      true,
      HTTP_RESPONSE_CODE.CREATED,
      APP_MESSAGE.signedUp,
      {
        user: newUser,
      }
    );
  } catch (err) {
    next(err);
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendResponse(
        res,
        false,
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        APP_MESSAGE.missingRequiredFields
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return sendResponse(
        res,
        false,
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        APP_MESSAGE.invalidCredentials
      );
    }

    const decodedPassword = await argon.verify(user.password, password);

    if (!decodedPassword) {
      return sendResponse(
        res,
        false,
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        APP_MESSAGE.invalidCredentials
      );
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      configs.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    return sendResponse(
      res,
      true,
      HTTP_RESPONSE_CODE.OK,
      APP_MESSAGE.signedIn,
      {
        user,
        token: accessToken,
      }
    );
  } catch (err) {
    next(err);
  }
};

import { NextFunction, Request, Response } from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { sendResponse } from "../helpers/response.helper";
import { APP_MESSAGE, HTTP_RESPONSE_CODE } from "../constants";
import prisma from "../prisma/prisma";
import { sendMail } from "../helpers/mail.helper";
import { configs, cookieOptions } from "../configs";
import { Student } from "@prisma/client";

export const studentSignIn = async (
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

    const student = await prisma.student.findUnique({
      where: {
        email,
      },
    });

    if (!student) {
      return sendResponse(
        res,
        false,
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        APP_MESSAGE.invalidCredentials
      );
    }

    const decryptPassword: boolean = await argon2.verify(
      student.password_hash,
      password
    );

    if (!decryptPassword) {
      return sendResponse(
        res,
        false,
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        APP_MESSAGE.invalidCredentials
      );
    }

    const accessToken = jwt.sign(
      {
        id: student.id,
        email: student.email,
      },
      configs.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    res.cookie("accessToken", accessToken, cookieOptions);

    return sendResponse(
      res,
      true,
      HTTP_RESPONSE_CODE.OK,
      APP_MESSAGE.signedIn,
      {
        student,
      }
    );
  } catch (err) {
    next(err);
  }
};

// change password and update temp_password = false
export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentUser = req.user;
    const { password } = req.body;

    if (!password) {
      return sendResponse(
        res,
        false,
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        APP_MESSAGE.missingRequiredFields
      );
    }

    const data = await prisma.student.findUnique({
      where: {
        email: currentUser.email,
      },
    });

    if (!data) {
      return sendResponse(
        res,
        false,
        HTTP_RESPONSE_CODE.UNAUTHORIZED,
        APP_MESSAGE.userUnauthorized
      );
    }

    const password_hash = await argon2.hash(password);

    await prisma.student.update({
      where: {
        email: currentUser.email,
      },
      data: {
        password_hash,
        temp_password: false,
      },
    });

    return sendResponse(
      res,
      true,
      HTTP_RESPONSE_CODE.OK,
      APP_MESSAGE.passwordChanged
    );
  } catch (err) {
    next(err);
  }
};

export const addStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, group, email, batch } = req.body;

    if (!name || !group || !email || !batch) {
      return sendResponse(
        res,
        false,
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        APP_MESSAGE.missingRequiredFields
      );
    }

    const student = await prisma.student.findFirst({
      where: {
        email,
      },
    });

    if (student) {
      return sendResponse(
        res,
        false,
        HTTP_RESPONSE_CODE.CONFLICT,
        APP_MESSAGE.studentDuplicatedEmail
      );
    }

    const chars =
      "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const passwordLength = 10;
    let password = "mmaso";
    for (var i = 6; i <= passwordLength; i++) {
      var randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }

    const password_hash = await argon2.hash(password);

    const newStudent = await prisma.student.create({
      data: {
        email,
        group,
        batch: Number(batch),
        name,
        password_hash,
      },
    });

    await sendMail(newStudent, password);

    return sendResponse(
      res,
      true,
      HTTP_RESPONSE_CODE.CREATED,
      APP_MESSAGE.studentCreated,
      {
        student: newStudent,
      }
    );
  } catch (err) {
    next(err);
  }
};

export const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const students = await prisma.student.findMany();

    return sendResponse(res, true, HTTP_RESPONSE_CODE.OK, APP_MESSAGE.success, {
      students,
    });
  } catch (err) {
    next(err);
  }
};

export const getStudentProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as Student;

    const profile = await prisma.student.findUnique({
      where: {
        email: user.email,
      },
    });

    if (!profile) {
      return sendResponse(
        res,
        false,
        HTTP_RESPONSE_CODE.NOT_FOUND,
        APP_MESSAGE.studentNotFound
      );
    }

    return sendResponse(res, true, HTTP_RESPONSE_CODE.OK, APP_MESSAGE.success, {
      profile,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const existing = await prisma.student.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existing)
      return sendResponse(
        res,
        false,
        HTTP_RESPONSE_CODE.NOT_FOUND,
        APP_MESSAGE.studentNotFound
      );

    await prisma.student.delete({
      where: {
        id: Number(id),
      },
    });

    return sendResponse(
      res,
      true,
      HTTP_RESPONSE_CODE.OK,
      APP_MESSAGE.studentDeleted
    );
  } catch (err) {
    next(err);
  }
};

export const getStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const existing = await prisma.student.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existing) {
      return sendResponse(
        res,
        false,
        HTTP_RESPONSE_CODE.NOT_FOUND,
        APP_MESSAGE.studentNotFound
      );
    }

    return sendResponse(res, true, HTTP_RESPONSE_CODE.OK, APP_MESSAGE.success, {
      student: existing,
    });
  } catch (err) {
    next(err);
  }
};

export const editStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, group, email, batch } = req.body;
    const { id } = req.params;

    if (!name || !group || !email || !batch) {
      return sendResponse(
        res,
        false,
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        APP_MESSAGE.missingRequiredFields
      );
    }

    const existing = await prisma.student.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existing) {
      return sendResponse(
        res,
        false,
        HTTP_RESPONSE_CODE.NOT_FOUND,
        APP_MESSAGE.studentNotFound
      );
    }

    await prisma.student.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        group,
        email,
        batch: Number(batch),
      },
    });

    return sendResponse(
      res,
      true,
      HTTP_RESPONSE_CODE.OK,
      APP_MESSAGE.studentUpdated
    );
  } catch (err) {
    next(err);
  }
};

import { NextFunction, Request, Response } from "express";
import argon2 from "argon2";
import { sendResponse } from "../helpers/response.helper";
import { APP_MESSAGE, HTTP_RESPONSE_CODE } from "../constants";
import prisma from "../prisma/prisma";
import { sendMail } from "../helpers/mail.helper";

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
        const passwordLength = 12;
        let password = "";
        for (var i = 0; i <= passwordLength; i++) {
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

        return sendResponse(
            res,
            true,
            HTTP_RESPONSE_CODE.OK,
            APP_MESSAGE.success,
            {
                students,
            }
        );
    } catch (err) {
        next(err);
    }
};

import argon2 from "argon2";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma/prisma";
import { sendResponse } from "../helpers/response.helper";
import { APP_MESSAGE, HTTP_RESPONSE_CODE } from "../constants";
import { configs, cookieOptions } from "../configs";

export const createAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const email = "admin@mmaso.com";
        const password = "adminmmaso";

        const hashedPassword = await argon2.hash(password);

        await prisma.admin.create({
            data: {
                email,
                password_hash: hashedPassword,
            },
        });

        return sendResponse(
            res,
            true,
            HTTP_RESPONSE_CODE.CREATED,
            APP_MESSAGE.adminCreated
        );
    } catch (err) {
        next(err);
    }
};

export const adminSignIn = async (
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

        const admin = await prisma.admin.findUnique({
            where: {
                email,
            },
        });

        if (!admin) {
            return sendResponse(
                res,
                false,
                HTTP_RESPONSE_CODE.BAD_REQUEST,
                APP_MESSAGE.invalidCredentials
            );
        }

        const decryptPassword = await argon2.verify(
            admin.password_hash,
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
                id: admin.id,
                email: admin.email,
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
            APP_MESSAGE.adminSignedIn
        );
    } catch (err) {
        next(err);
    }
};

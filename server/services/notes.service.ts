import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../helpers/response.helper";
import { APP_MESSAGE, HTTP_RESPONSE_CODE } from "../constants";
import prisma from "../prisma/prisma";

// create notes
export const createNote = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { title, subject, content } = req.body;
        const user = req.user;

        if (!title || !subject || !content) {
            return sendResponse(
                res,
                false,
                HTTP_RESPONSE_CODE.BAD_REQUEST,
                APP_MESSAGE.missingRequiredFields
            );
        }

        const newNote = await prisma.note.create({
            data: {
                ownerId: user.id,
                title,
                subject,
                content,
            },
        });

        return sendResponse(
            res,
            true,
            HTTP_RESPONSE_CODE.CREATED,
            APP_MESSAGE.noteCreated,
            {
                note: newNote,
            }
        );
    } catch (err) {
        next(err);
    }
};

// update notes

// delete notes

// get note

// get notes
export const getNotes = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user;

        const notes = await prisma.note.findMany({
            where: {
                ownerId: user.id,
            },
        });

        return sendResponse(
            res,
            true,
            HTTP_RESPONSE_CODE.OK,
            APP_MESSAGE.success,
            {
                notes,
            }
        );
    } catch (err) {
        next(err);
    }
};

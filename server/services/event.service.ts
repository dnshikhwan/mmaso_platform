import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../helpers/response.helper";
import { APP_MESSAGE, HTTP_RESPONSE_CODE } from "../constants";
import prisma from "../prisma/prisma";

export const createEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, description, date, venue, participant_limit } = req.body;
        const adminId = 1;

        if (!name || !description || !date || !venue || !participant_limit) {
            return sendResponse(
                res,
                false,
                HTTP_RESPONSE_CODE.BAD_REQUEST,
                APP_MESSAGE.missingRequiredFields
            );
        }

        const newEvent = await prisma.event.create({
            data: {
                name,
                description,
                date: new Date(date),
                venue,
                participant_limit: Number(participant_limit),
                adminId,
            },
        });

        return sendResponse(
            res,
            true,
            HTTP_RESPONSE_CODE.CREATED,
            APP_MESSAGE.eventCreated,
            {
                event: newEvent,
            }
        );
    } catch (err) {
        next(err);
    }
};

export const getAllEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const events = await prisma.event.findMany({
            where: {
                date: {
                    gte: new Date(),
                },
            },
            orderBy: {
                date: "asc",
            },
        });

        return sendResponse(
            res,
            true,
            HTTP_RESPONSE_CODE.OK,
            APP_MESSAGE.success,
            {
                events,
            }
        );
    } catch (err) {
        next(err);
    }
};

export const deleteEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const eventId = id;

        if (!eventId) {
            return sendResponse(
                res,
                false,
                HTTP_RESPONSE_CODE.BAD_REQUEST,
                APP_MESSAGE.missingRequiredFields
            );
        }

        const event = await prisma.event.findFirst({
            where: {
                id: Number(eventId),
            },
        });

        if (!event) {
            return sendResponse(
                res,
                false,
                HTTP_RESPONSE_CODE.NOT_FOUND,
                APP_MESSAGE.eventNotFound
            );
        }

        await prisma.event.delete({
            where: {
                id: event.id,
            },
        });

        return sendResponse(
            res,
            true,
            HTTP_RESPONSE_CODE.OK,
            APP_MESSAGE.eventDeleted
        );
    } catch (err) {
        next(err);
    }
};

export const getEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const event = await prisma.event.findFirst({
            where: {
                id: Number(id),
            },
        });

        if (!event) {
            return sendResponse(
                res,
                false,
                HTTP_RESPONSE_CODE.NOT_FOUND,
                APP_MESSAGE.eventNotFound
            );
        }

        return sendResponse(
            res,
            true,
            HTTP_RESPONSE_CODE.OK,
            APP_MESSAGE.success,
            {
                event,
            }
        );
    } catch (err) {
        next(err);
    }
};

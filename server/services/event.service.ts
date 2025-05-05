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

    const admin = await prisma.admin.findFirst({
      where: {
        email: "admin@mmaso.com",
      },
    });

    if (!admin) return;

    const adminId = admin.id;

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

    return sendResponse(res, true, HTTP_RESPONSE_CODE.OK, APP_MESSAGE.success, {
      events,
    });
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
    const user = req.user;

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

    const currentParticipationCount = await prisma.studentEvent.count({
      where: {
        eventId: event.id,
      },
    });

    const existingParticipation = await prisma.studentEvent.findFirst({
      where: {
        eventId: event.id,
        studentId: user.id,
      },
    });

    let joined = false;
    if (existingParticipation) {
      joined = true;
    }

    return sendResponse(res, true, HTTP_RESPONSE_CODE.OK, APP_MESSAGE.success, {
      event,
      joined,
      count: currentParticipationCount,
    });
  } catch (err) {
    next(err);
  }
};

export const editEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, date, venue, participant_limit } = req.body;
    const { id } = req.params;

    if (!name || !description || !date || !venue || !participant_limit) {
      return sendResponse(
        res,
        false,
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        APP_MESSAGE.missingRequiredFields
      );
    }

    const existing = await prisma.event.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!existing) {
      return sendResponse(
        res,
        false,
        HTTP_RESPONSE_CODE.NOT_FOUND,
        APP_MESSAGE.eventNotFound
      );
    }

    await prisma.event.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        description,
        date,
        venue,
        participant_limit: Number(participant_limit),
      },
    });

    return sendResponse(
      res,
      true,
      HTTP_RESPONSE_CODE.OK,
      APP_MESSAGE.eventUpdated
    );
  } catch (err) {
    next(err);
  }
};

export const joinEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const { eventId } = req.params;

    // check if user already joined?
    const isJoined = await prisma.studentEvent.findFirst({
      where: {
        eventId: Number(eventId),
        studentId: user.id,
      },
    });

    if (isJoined) {
      return sendResponse(
        res,
        false,
        HTTP_RESPONSE_CODE.CONFLICT,
        APP_MESSAGE.studentAlreadyJoined
      );
    }

    // check if limit reached
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

    const currentParticipant = await prisma.studentEvent.count({
      where: {
        eventId: Number(eventId),
      },
    });

    const canJoin = event.participant_limit >= currentParticipant;

    if (!canJoin) {
      return sendResponse(
        res,
        false,
        HTTP_RESPONSE_CODE.CONFLICT,
        APP_MESSAGE.eventAlreadyMaxed
      );
    }

    await prisma.studentEvent.create({
      data: {
        studentId: user.id,
        eventId: Number(eventId),
      },
    });

    return sendResponse(
      res,
      true,
      HTTP_RESPONSE_CODE.CREATED,
      APP_MESSAGE.studentJoined
    );
  } catch (err) {
    next(err);
  }
};

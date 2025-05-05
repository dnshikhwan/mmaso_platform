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
export const editNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, subject, content } = req.body;
    const user = req.user;
    const { id } = req.params;

    if (!title || !subject || !content) {
      return sendResponse(
        res,
        false,
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        APP_MESSAGE.missingRequiredFields
      );
    }

    const existing = await prisma.note.findFirst({
      where: {
        id: Number(id),
        ownerId: user.id,
      },
    });

    if (!existing) {
      return sendResponse(
        res,
        false,
        HTTP_RESPONSE_CODE.NOT_FOUND,
        APP_MESSAGE.noteNotFound
      );
    }

    await prisma.note.update({
      where: {
        id: Number(id),
        ownerId: user.id,
      },
      data: {
        title,
        subject,
        content,
      },
    });

    return sendResponse(
      res,
      true,
      HTTP_RESPONSE_CODE.OK,
      APP_MESSAGE.noteUpdated
    );
  } catch (err) {
    next(err);
  }
};

// delete notes
export const deleteNotes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const existing = await prisma.note.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existing) {
      return sendResponse(
        res,
        false,
        HTTP_RESPONSE_CODE.NOT_FOUND,
        APP_MESSAGE.noteNotFound
      );
    }

    await prisma.note.delete({
      where: {
        id: existing.id,
      },
    });

    return sendResponse(
      res,
      true,
      HTTP_RESPONSE_CODE.OK,
      APP_MESSAGE.noteDeleted
    );
  } catch (err) {
    next(err);
  }
};

// get note
export const getNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const existing = await prisma.note.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existing) {
      return sendResponse(
        res,
        false,
        HTTP_RESPONSE_CODE.NOT_FOUND,
        APP_MESSAGE.noteNotFound
      );
    }

    return sendResponse(res, true, HTTP_RESPONSE_CODE.OK, APP_MESSAGE.success, {
      note: existing,
    });
  } catch (err) {
    next(err);
  }
};

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

    return sendResponse(res, true, HTTP_RESPONSE_CODE.OK, APP_MESSAGE.success, {
      notes,
    });
  } catch (err) {
    next(err);
  }
};

import { NextFunction, Request, Response } from "express";
import prisma from "../prisma/prisma";
import { sendResponse } from "../helpers/response.helper";
import { APP_MESSAGE, HTTP_RESPONSE_CODE } from "../constants";

export const addAnnouncement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, content } = req.body;
    const admin = await prisma.admin.findUnique({
      where: {
        email: "admin@mmaso.com",
      },
    });

    if (!admin)
      return sendResponse(
        res,
        false,
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        APP_MESSAGE.serverError
      );

    const adminId = admin.id;

    const newAnnouncement = await prisma.announcement.create({
      data: {
        title,
        content,
        adminId,
      },
    });

    const students = await prisma.student.findMany({
      select: {
        id: true,
      },
    });

    const data = students.map((student) => ({
      studentId: student.id,
      announcementId: newAnnouncement.id,
      isRead: false,
    }));

    await prisma.announcementStudent.createMany({ data });

    return sendResponse(
      res,
      true,
      HTTP_RESPONSE_CODE.CREATED,
      APP_MESSAGE.announcementCreated,
      {
        announcement: newAnnouncement,
      }
    );
  } catch (err) {
    next(err);
  }
};

export const getAnnouncements = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const announcements = await prisma.announcement.findMany();

    return sendResponse(res, true, HTTP_RESPONSE_CODE.OK, APP_MESSAGE.success, {
      announcements,
    });
  } catch (err) {
    next(err);
  }
};

export const getAnnouncementsByStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    const all = await prisma.announcementStudent.findMany({
      where: {
        studentId: user.id,
      },
      include: {
        announcement: true,
      },
    });

    return sendResponse(res, true, HTTP_RESPONSE_CODE.OK, APP_MESSAGE.success, {
      announcements: all,
    });
  } catch (err) {
    next(err);
  }
};

export const markAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const { id } = req.params;

    const updated = await prisma.announcementStudent.updateMany({
      where: {
        studentId: user.id,
        id: Number(id),
      },
      data: {
        isRead: true,
      },
    });

    return sendResponse(res, true, HTTP_RESPONSE_CODE.OK, APP_MESSAGE.success);
  } catch (err) {
    next(err);
  }
};

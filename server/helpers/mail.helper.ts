import nodemailer from "nodemailer";
import { configs } from "../configs";
import { logger } from "./log.helper";
import { Student } from "@prisma/client";
import { studentCredentialsTemplate } from "../templates/studentCred.template";

const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: configs.MAIL_USER,
        pass: configs.MAIL_PASS,
    },
});

export const sendMail = async (student: Student, password: string) => {
    try {
        await mailTransporter.sendMail({
            from: "adminmmaso@gmail.com",
            to: student.email,
            subject: "MMASO Plaform",
            html: studentCredentialsTemplate(
                student.name,
                student.email,
                password
            ),
        });
    } catch (err) {
        logger.error("Error sending email to user");
    }
};

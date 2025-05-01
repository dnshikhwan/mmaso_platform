import { Router } from "express";
import {
    addStudent,
    changePassword,
    getAllStudents,
    getStudentProfile,
    studentSignIn,
} from "../services/student.service";
import { authMiddleware } from "../middlewares/auth.middleware";

const studentController = () => {
    const router = Router();

    router.post("/add-student", authMiddleware, addStudent);
    router.get("/get-students", authMiddleware, getAllStudents);
    router.post("/sign-in", studentSignIn);
    router.post("/change-password", authMiddleware, changePassword);
    router.get("/profile", authMiddleware, getStudentProfile);

    return router;
};

export default studentController;

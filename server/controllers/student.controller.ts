import { Router } from "express";
import {
    addStudent,
    getAllStudents,
    getStudentProfile,
    studentSignIn,
} from "../services/student.service";
import { authMiddleware } from "../middlewares/auth.middleware";

const studentController = () => {
    const router = Router();

    router.post("/add-student", addStudent);
    router.get("/get-students", getAllStudents);
    router.post("/sign-in", studentSignIn);
    router.get("/profile", authMiddleware, getStudentProfile);

    return router;
};

export default studentController;

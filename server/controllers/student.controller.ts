import { Router } from "express";
import {
    addStudent,
    getAllStudents,
    studentSignIn,
} from "../services/student.service";

const studentController = () => {
    const router = Router();

    router.post("/add-student", addStudent);
    router.get("/get-students", getAllStudents);
    router.post("/sign-in", studentSignIn);

    return router;
};

export default studentController;

import { Router } from "express";
import { addStudent, getAllStudents } from "../services/student.service";

const studentController = () => {
    const router = Router();

    router.post("/add-student", addStudent);
    router.get("/get-students", getAllStudents);

    return router;
};

export default studentController;

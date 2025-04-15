import { Router } from "express";
import { adminSignIn, createAdmin } from "../services/admin.service";

const adminController = () => {
    const router = Router();

    router.get("/create-admin", createAdmin);
    router.post("/sign-in", adminSignIn);

    return router;
};

export default adminController;

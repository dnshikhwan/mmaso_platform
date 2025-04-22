import { Router } from "express";
import { adminSignIn, createAdmin, signOut } from "../services/admin.service";

const adminController = () => {
    const router = Router();

    router.get("/create-admin", createAdmin);
    router.post("/sign-in", adminSignIn);
    router.post("/sign-out", signOut);

    return router;
};

export default adminController;

import { Router } from "express";
import { signIn, signUp } from "../services/auth.service";

const authController = () => {
  const router = Router();

  router.post("/sign-up", signUp);
  router.post("/sign-in", signIn);

  return router;
};

export default authController;

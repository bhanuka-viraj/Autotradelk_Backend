import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { GoogleAuthController } from "../controllers/google.auth.controller";

const router = Router();
const authController = new AuthController();
const googleAuthController = new GoogleAuthController();

router.post("/signup", authController.signup.bind(authController));
router.post("/login", authController.login.bind(authController));
router.post(
  "/google",
  googleAuthController.googleLogin.bind(googleAuthController)
);

export default router;

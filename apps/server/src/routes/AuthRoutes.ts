import {
  checkUser,
  generateToken,
  onboardUser,
} from "@/controllers/AuthController";
import { Router } from "express";

const router: Router = Router();

router.post("/check-user", checkUser);
router.post("/onboard-user", onboardUser);
router.get("/generate-token/:userId", generateToken);

export default router;

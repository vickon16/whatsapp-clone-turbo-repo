import { checkUser, onboardUser } from "@/controllers/AuthController";
import { Router } from "express";

const router: Router = Router();

router.post("/check-user", checkUser);
router.post("/onboard-user", onboardUser);

export default router;

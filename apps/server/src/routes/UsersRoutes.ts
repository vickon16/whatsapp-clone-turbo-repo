import { getAllUsers } from "@/controllers/UserController";
import { Router } from "express";

const router: Router = Router();

router.get("/", getAllUsers);

export default router;

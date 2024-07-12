import { getAllUsers, getAllOnlineUsersId } from "@/controllers/UserController";
import { Router } from "express";

const router: Router = Router();

router.get("/", getAllUsers);
router.get("/online-users-id", getAllOnlineUsersId);

export default router;

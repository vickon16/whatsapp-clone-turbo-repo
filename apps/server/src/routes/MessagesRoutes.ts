import {
  addPairMessages,
  getPairMessages,
  getChatListMessages,
} from "@/controllers/MessageController";
import { Router } from "express";

const router: Router = Router();

router.post("/add-pair-messages", addPairMessages);
router.get("/get-pair-messages", getPairMessages);
router.get("/get-chat-list-messages/:senderId", getChatListMessages);

export default router;

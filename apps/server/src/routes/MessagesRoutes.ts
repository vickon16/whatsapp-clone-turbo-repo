import {
  addPairMessages,
  setReadMessages,
  getAllUserPairs,
  addImageAudioMessage,
} from "@/controllers/MessageController";
import { Router } from "express";
import multer from "multer";

const router: Router = Router();

const uploadImage = multer({ dest: "uploads/images/" });
const uploadAudio = multer({ dest: "uploads/audios/" });

router.post("/add-pair-messages", addPairMessages);
router.get("/set-read-messages", setReadMessages);
router.get("/get-all-user-pairs/:userId", getAllUserPairs);
router.post(
  "/add-image-message",
  uploadImage.single("image"),
  addImageAudioMessage
);
router.post(
  "/add-audio-message",
  uploadAudio.single("audio"),
  addImageAudioMessage
);

export default router;

import { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getUsers, getUserByIdController } from "../controllers/userController.js";

const router = Router();

router.get("/", protect, getUsers);            // Host sees all users
router.get("/:id", protect, getUserByIdController);  // Host sees one user by ID

export default router;

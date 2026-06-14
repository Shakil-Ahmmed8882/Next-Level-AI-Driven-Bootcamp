import { Router } from "express";
import { userControllers } from "./user.controller";
import { auth } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/",auth(), userControllers.getAllUsers);
router.post("/", userControllers.createUser);
router.get("/:id", userControllers.getUserById);
router.put("/:id", userControllers.updateUser);
router.delete("/:id", userControllers.deleteUser);

export const userRoute = router;
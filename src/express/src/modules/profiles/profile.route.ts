import { Router } from "express";
import { profileControllers } from "./profile.controllers";


const router = Router();

router.post("/", profileControllers.createProfile);

export const profileRoute = router;
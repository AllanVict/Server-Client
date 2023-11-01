import { Router } from "express";
import { Home } from "../Controllers/home";

export const router = Router();

router.get("/", Home);

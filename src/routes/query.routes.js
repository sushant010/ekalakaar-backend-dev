import { Router } from "express";
import { createQuery } from "../controllers/query.controllers.js";

const router = Router();

router.route("/post-query").post(createQuery);

export default router;

import { Router } from "express";
import opportunityController from "../controllers/opportunity.controllers.js";
import artistController from "../controllers/artist.controllers.js";
import { protect, restrictTo } from "../middlewares/auth.middlewares.js";

const router = Router();

router.use(protect, restrictTo("Admin"));

router.route("/").get(opportunityController.getArtistOpp);

export default router;

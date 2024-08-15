import { Router } from "express";
import patronControllers from "../controllers/patron.controllers.js";
import opportunityControllers from "../controllers/opportunity.controllers.js";
import applicationContollers from "../controllers/application.contollers.js";

import { protect, restrictTo } from "../middlewares/auth.middlewares.js";
import { avatarValidationMiddlewares, upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router.use(protect, restrictTo("Patron"));

router.route("/profile").get(patronControllers.getUser).patch(patronControllers.updateUser).delete(patronControllers.deleteUser);

router.route("/profile/avatar").post(upload.array("avatar"), ...avatarValidationMiddlewares, patronControllers.updateAvatar);

// Get -> All Applications  (?opportunityId | ?status -> optional)
router.route("/opportunities/applications").get(applicationContollers.getPatronApplications);

// Get -> All Opportunities
router.route("/opportunities").post(opportunityControllers.createPatronOpportunity).get(opportunityControllers.getPatronOpps);

// GET | PATCH | DELETE -> Get an opportunity | Update an opportunity | Delete an opportunity
router.route("/opportunities/:id").get(opportunityControllers.getPatronOpportunity).patch(opportunityControllers.updatePatronOpportunity).delete(opportunityControllers.deletePatronOpportunity);

// GET | PATCH | DELETE -> Get an application | Update an application ( body -> {status} ) | Delete an application
router.route("/opportunities/applications/:id").get(applicationContollers.getPatronApplication).patch(applicationContollers.updatePatronApplication);

// GET -> All Artists
router.route("/artists").get(patronControllers.getArtistProfiles);

// GET -> Get an Artist Profile
router.route("/artists/:id").get(patronControllers.getArtistProfile);

export default router;

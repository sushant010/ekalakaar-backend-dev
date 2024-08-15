import { Router } from "express";

import adminController from "../controllers/admin.controllers.js";

import  oppsController from "../controllers/opportunity.controllers.js";

import  appsController from "../controllers/application.contollers.js";

import eventsController from "../controllers/events.controllers.js";

import { UpdateUser, DeleteUser } from "../controllers/user.controllers.js";

import { protect, restrictTo } from "../middlewares/auth.middlewares.js";
// import { filterReqBody } from "../middlewares/user.middlewares.js";

const router = Router();

router.use(protect, restrictTo("Admin"));

router.get("/users?", adminController.getUsers);

router.get("/user/:id", adminController.getUserById);

router.patch("/updateuser/:id", UpdateUser);

router.delete("/deleteuser/:id", DeleteUser);

router.get("/opps", oppsController.getArtistOpps);

router.get("/opps/:id", oppsController.getArtistOpp);

router.post("/postopps", adminController.postOpps);

router.patch("/updateopps?", adminController.updateOpps);

router.patch("/updateappstatus?", adminController.updateAppStatus);

router.delete("/deleteopps?", adminController.deleteOpps);

router.get("/allapps", appsController.getAllApps);

router.get("/oppapps?", appsController.getOppApps);

// router.route("/users/:id").get(adminController.getUserById).patch(filterReqBody, adminController.updateUserById);

router.get("/users/artist/:id/applications", adminController.getArtistApplications);

// New Event Routes

router.get("/events", eventsController.getAllEvents);

router.get("/events/:id", eventsController.getEventById);

router.post("/events", eventsController.createEvent);

router.patch("/events/:id", eventsController.updateEvent);

router.delete("/events/:id", eventsController.deleteEvent);

export default router;

import { Router } from "express";
import artistController from "../controllers/artist.controllers.js";
import opportunityController from "../controllers/opportunity.controllers.js";
import { protect, restrictTo } from "../middlewares/auth.middlewares.js";
import { avatarValidationMiddlewares, documentValidationMiddlewares, perfImgsValidationMiddlewares, upload, videosValidationMiddlewares } from "../middlewares/multer.middlewares.js";

const router = Router();

//get Artiest Profile without login
router.get('/profile/:userId',artistController.getUser);

router.use(protect, restrictTo("Artist"));

router.route("/profile").get(artistController.getUser).patch(artistController.updateUser).delete(artistController.deleteUser);

router.route("/profile/avatar").post(upload.array("avatar"), ...avatarValidationMiddlewares, artistController.updateAvatar);

router.route("/profile/perf-images").post(upload.array("images"), ...perfImgsValidationMiddlewares, artistController.updatePerfImages);

router.route("/profile/perf-videos").post(upload.array("videos"), ...videosValidationMiddlewares, artistController.updatePerfVideos);

// Get -> All Opportunities
router.route("/opportunities").get(opportunityController.getArtistOpps);

// GET -> Get an opportunity
router.route("/opportunities/:id").get(opportunityController.getArtistOpp);

// GET -> ( with query filter (optional) ?status=Hired | Rejected | In-Progress) All
router.route("/applications").get(artistController.getAppliedApplications);

// POST -> Apply
router.route("/applications/:id").post(artistController.applyForOpportunity);

// Get -> All Saved Opportunities
router.route("/saved-opportunities").get(artistController.savedOpportunities);

// POST | DELETE -> Save an opportunity | Unsave an opportunity
router.route("/saved-opportunities/:id").post(artistController.saveOpportunity).delete(artistController.unSaveOpportunity);

// New routes
router.route("/profile/highest-education")
.get(artistController.getHighestEducation)
.patch(artistController.updateHighestEducation);

router.route("/profile/bank-account-details")
.get(artistController.getBankAccountDetails)
.patch(artistController.updateBankAccountDetails);

//new routes
router.route("/profile/performance-info")
  .patch(artistController.updatePerformanceInfo);


  //new route for upload document
  router.route("/profile/art-documents/upload")
   .post( upload.array("documents"), ...documentValidationMiddlewares, artistController.uploadArtDocuments);
  router.route("/profile/performance-documents/upload")
   .post(upload.array("documents"), ...documentValidationMiddlewares, artistController.uploadPerformanceDocuments);
  router.route("/profile/award-documents/upload")
   .post(upload.array("documents"), ...documentValidationMiddlewares, artistController.uploadAwardDocuments);
  router.route('/upload-documents').post( upload.array("documents"), ...documentValidationMiddlewares, artistController.uploadDocuments)


export default router;

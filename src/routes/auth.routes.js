import passport from "passport";
import "../passport/index.js";
import { Router } from "express";
import { protect, restrictTo } from "../middlewares/auth.middlewares.js";
import authControllers from "../controllers/auth.controllers.js";

const router = Router();

// user register
router.route("/register").post(authControllers.registerUser);

// // send register otp
router.post("/register-otp/send-otp", authControllers.sendRegisterOtp);

// // verify registration otp
router.post("/verify-register-otp/verify-otp", authControllers.verifysendRegisterOtp);




// login with email and password
router.route("/login").post(authControllers.loginUser);

//login with otp
router.post("/sent-otp", authControllers.loginWithOtp);

router.post("/verify-otp", authControllers.verifyLoginOtp);

router.post("/refresh-token", authControllers.refreshAccessToken);

//login with email using firebase login
router.post('/login-with-email',authControllers.handleSocialLoginWithEmail);

//login with google and facebook (facebook is not in action right now)
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
  (req, res) => {
    res.send("redirecting to google...");
  }
);

router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email"],
  }),
  (req, res) => {
    res.send("redirecting to facebook...");
  }
);

router.get("/google/callback", passport.authenticate("google"), authControllers.handleSocialLogin);

router.get("/facebook/callback", passport.authenticate("facebook"), authControllers.handleSocialLogin);

// login utilities -

// forgot password
router.post("/forgot-password/send-otp", authControllers.sendForgotPassOtp);

// verfify forgot password OTP
router.post("/forgot-password/verify-otp", authControllers.verifyForgotPassOtp);

//reset password
router.post("/forgot-password/reset-password", protect, restrictTo("Artist", "Patron"), authControllers.resetPassword);

export default router;

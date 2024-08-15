import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";

import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), "./src/.env") });

try {
  passport.serializeUser((user, next) => {
    next(null, user._id);
  });

  passport.deserializeUser(async (id, next) => {
    try {
      const user = await User.findById(id);
      if (user) next(null, user);
      else next(new ApiError("User does not exist", 404), null);
    } catch (error) {
      next(new ApiError("Something went wrong while deserializing the user. Error: " + error, 500), null);
    }
  });

  const CommonStrategy = (StrategyName, credentials) => {
    return new StrategyName(credentials, async (_, __, profile, next) => {
      console.log(profile);
      const user = await User.findOne({ email: profile._json.email });

      if (!profile._json.email) {
        next(new ApiError("User does not have a public email associated with their account. Please try another login method", 400), null);
      }

      if (!user) {
        next(new ApiError("User does not exist", 500), null);
      } else {
        next(null, user);
      }
    });
  };

  passport.use(
    CommonStrategy(GoogleStrategy, {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    })
  );

  passport.use(
    CommonStrategy(FacebookStrategy, {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["emails"],
    })
  );
} catch (error) {
  console.error("PASSPORT ERROR: ", error);
}

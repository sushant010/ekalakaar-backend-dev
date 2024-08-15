import { promisify } from "util";
import jwt from "jsonwebtoken";
import _ from "lodash";

import User from "../models/user.model.js";

import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";

const protect = catchAsync(async (req, res, next) => {
  let token;
  if (!_.isEmpty(req.headers.authorization) && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (_.isEmpty(token)) {
    return next(new ApiError("You are not logged in! Please login to get acesss.", 401));
  }

  const decode = await promisify(jwt.verify)(token, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(decode._id).select("+role +avatar +refreshToken");

  if (_.isEmpty(user)) {
    return next(new ApiError("The user belonging to this token does no longer exist!", 401));
  }

  // if (await user.changedPasswordAfter(decode.iat)) {
  //   return next(new ApiError("User recently changed password! Please login again.", 401));
  // }

  req.user = user;
  res.locals.user = user;

  next();
});

const isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next();
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next();
    }

    res.locals.user = currentUser;
    return next();
  }
  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(new ApiError("You do not have permission to perform this action!", 403));
    }
    next();
  };
};

export { protect, restrictTo, isLoggedIn };

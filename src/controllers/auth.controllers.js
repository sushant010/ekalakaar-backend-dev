import twilio from "twilio";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Models
import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";

// Response and Error handling
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import catchAsync from "../utils/catchAsync.js";

// Utilities
import { otpExpirationTime } from "../constants.js";
import { sendForgotPasswordOtp, sendPasswordResetSuccessMail, sendWelcomeMail,sendRegisterrOtp } from "../utils/mail.js";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// const generateAccessAndRefreshTokens = async (userId) => {
//   try {
//     const user = await User.findById(userId);

//     const accessToken = user.generateAccessToken();
//     const refreshToken = user.generateRefreshToken();

//     user.refreshToken = refreshToken;

//     await user.save({ validateBeforeSave: false });
//     return {
//       accessToken,
//       refreshToken,
//     };
//   } catch (error) {
//     throw new ApiError(500, "Something went wrong while generating the access token");
//   }
// };

// const refreshAccessToken = catchAsync(async (req, res) => {
//   const token = req.cookies.refreshToken || req.body.refreshToken;

//   if (!token) {
//     throw new ApiError("Refresh token not found! Unauthorized request", 401);
//   }

//   let decodedToken;

//   jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (error, result) => {
//     if (!error) {
//       decodedToken = result;
//     }
//   });

//   const user = await User.findById(decodedToken?._id).select("+role +avatar +refreshToken");

//   if (!user) {
//     throw new ApiError("Invalid refresh token or expired! Please login again", 401);
//   }

//   if (token !== user?.refreshToken) {
//     throw new ApiError("Refresh token is expired or used", 401);
//   }

//   const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

//   const options = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//   };

//   res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new ApiResponse(200, { accessToken, refreshToken }));
// });


const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });
    
    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error("Error generating access token:", error);

    throw new ApiError(500, "Something went wrong while generating the access token");
  }
};


const refreshAccessToken = catchAsync(async (req, res) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;

  if (!token) {
    throw new ApiError("Refresh token not found! Unauthorized request", 401);
  }

  let decodedToken;

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (error, result) => {
    if (!error) {
      decodedToken = result;
    }
  });

  const user = await User.findById(decodedToken?._id).select("+role +avatar +refreshToken +isVerified");

  if (!user) {
    throw new ApiError("Invalid refresh token or expired! Please login again", 401);
  }

  if (!user.isVerified) {
    throw new ApiError(401, "User is not verified. Please complete the verification process.");
  }

  if (token !== user?.refreshToken) {
    throw new ApiError("Refresh token is expired or used", 401);
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new ApiResponse(200, { accessToken, refreshToken }));
});


// user register
// const registerUser = catchAsync(async (req, res) => {
//   const { email, firstName, lastName, password, phoneNumber, passwordConfirm, role, userType } = req.body;

//   const user = await User.create(req.body);

//   if (!user) {
//     throw new ApiError(500, "Something went wrong while registering the user");
//   }

//   sendWelcomeMail({ name: user.fullName, email: user.email });

//   return res.status(201).json(new ApiResponse(201, user));
// });

let registrationCount = 0;
const registerUser = catchAsync(async (req, res) => {
  const { email, firstName, lastName, password, phoneNumber, passwordConfirm, role, userType } = req.body;  
  // Generate the custom user ID
  const year = new Date().getFullYear();
  const month = (new Date().getMonth() + 1).toString().padStart(2, "0"); 
  // const numericPortion = (existingUsersCount + 1).toString().padStart(3, "0");
  const numericPortion = (++registrationCount).toString().padStart(3, "0");
  const customID = `eK${role.substring(0, 2).toUpperCase()}${year}${firstName.substring(0, 2).toUpperCase()}${month}${numericPortion}`;

  // const user = await User.create({ ...req.body, customID }); 
  const user = await User.create({ ...req.body, customID, isVerified: false });

  if (!user) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  sendWelcomeMail({ name: user.fullName, email: user.email });

  return res.status(201).json(new ApiResponse(201, user));
});





//original
// //registration otp
const sendRegisterOtp = catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError("Email address not found", 404);
  }

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    throw new ApiError("User does not exist", 404);
  }

  const randomInt = Math.floor(100000 + Math.random() * 900000);

  let otp = await Otp.findOne({ userId: user._id });

  if (!otp) {
    otp = await Otp.create({
      otp: randomInt,
      userId: user._id,
      expirationTime: otpExpirationTime,
    });
  }

  const currentTime = new Date();
  const requestTime = otp.requestTime;
  const elapsedTime = currentTime - requestTime;
  const elapsedMinutes = Math.floor(elapsedTime / (1000 * 60));

  const timeLeftInMinutes = Math.max(0, 60 - elapsedMinutes);

  if (otp.count === 5) {
    throw new ApiError(`Too many requests for OTPs, please try again after ${timeLeftInMinutes} minute(s)`, 400);
  }

  otp.otp = randomInt;
  otp.expirationTime = otpExpirationTime;
  otp.requestTime = new Date();
  ++otp.count;

  await otp.save({ validateBeforeSave: true });

  const mailOptions = { name: user.fullName, email: user.email, otp: otp.otp };

  sendRegisterrOtp(mailOptions);

  setTimeout(async () => {
    await Otp.findByIdAndDelete(otp._id);
  }, 100000);

  res.status(200).json(new ApiResponse("OTP sent to email"));
});








// //original
// const verifysendRegisterOtp = catchAsync(async (req, res) => {
//   const { otp } = req.body;

//   if (!otp) {
//     throw new ApiError("Otp not found", 404);
//   }

//   const existingOtp = await Otp.findOneAndDelete({ otp });
  

//   if (!existingOtp) {
//     throw new ApiError("Incorrect OTP", 400);
//   }

//   const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(existingOtp.userId);

//   const options = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//   };

//   return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new ApiResponse(200, { accessToken, refreshToken }));
// });







// const verifysendRegisterOtp = catchAsync(async (req, res) => {
//   const { otp } = req.body;

//   if (!otp) {
//     throw new ApiError("Otp not found", 404);
//   }

//   const existingOtp = await Otp.findOneAndDelete({ otp });

//   if (!existingOtp) {
//     throw new ApiError("Incorrect OTP", 400);
//   }


//   const user = await User.findById(existingOtp.userId);

//   if (!user) {
//     throw new ApiError("User not found", 404);
//   }


  
//   user.isOtpVerified = true;

  
//   await user.save();

  
  

//   const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(existingOtp.userId);

//   const options = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//   };

//   return res
//     .status(200)
//     .cookie("accessToken", accessToken, options)
//     .cookie("refreshToken", refreshToken, options)
//     .json(new ApiResponse(200, { accessToken, refreshToken }));
// });

const verifysendRegisterOtp = catchAsync(async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    throw new ApiError("Otp not found", 404);
  }

  const existingOtp = await Otp.findOneAndDelete({ otp });

  if (!existingOtp) {
    throw new ApiError("Incorrect OTP", 400);
  }

  const user = await User.findById(existingOtp.userId);

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  // Fix the typo in the field name
  user.isVerified = true;

  await user.save();

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(existingOtp.userId);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new ApiResponse(200, { accessToken, refreshToken }));
});



// user login
// const loginUser = catchAsync(async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     throw new ApiError("email or password is required", 400);
//   }

//   const user = await User.findOne({ email }).select("+role -refreshToken +password");

//   if (!user) {
//     throw new ApiError("User does not exist", 404);
//   }

//   if (!user.isOtpVerified==true) {
//     throw new ApiError("User is not verified. Please complete the verification process.", 401);
//   }

//   const isPasswordValid = await user.isPasswordCorrect(password);

//   if (!isPasswordValid) {
//     throw new ApiError("Invalid user credentials", 401);
//   }


//   const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

//   const options = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//   };

//   return res
//     .status(200)
//     .cookie("accessToken", accessToken, options)
//     .cookie("refreshToken", refreshToken, options)
//     .json(new ApiResponse(200, { role: user.role, profileCompleted: user.profileCompleted, accessToken, refreshToken }));
// });


// user login
const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError("email or password is required", 400);
  }

  const user = await User.findOne({ email }).select("+role +password +isVerified");

  if (!user) {
    throw new ApiError("User does not exist", 404);
  }

  if (!user.isVerified) {
    throw new ApiError("User is not verified. Please complete the verification process.", 401);
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError("Invalid user credentials", 401);
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { role: user.role, profileCompleted: user.profileCompleted, accessToken, refreshToken }));
});





const loginWithOtp = catchAsync(async (req, res) => {
  const { countryCode, phoneNumber } = req.body;

  const phoneNumWithCountryCode = `${countryCode} ${phoneNumber}`;

  const user = await User.findOne({ phoneNumber: phoneNumWithCountryCode });

  if (!user) {
    throw new ApiError("User does not exist", 404);
  }

  const otpResponse = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID).verifications.create({
    to: phoneNumWithCountryCode,
    channel: "sms",
  });

  res.status(200).json(otpResponse);
});

const verifyLoginOtp = catchAsync(async (req, res) => {
  const { otp, countryCode, phoneNumber } = req.body;

  let phoneNumWithCountryCode = `${countryCode}${phoneNumber}`;

  await client.verify.v2.services(process.env.TWILIO_SERVICE_SID).verificationChecks.create({
    to: phoneNumWithCountryCode,
    code: otp,
  });

  phoneNumWithCountryCode = `${countryCode} ${phoneNumber}`;

  const user = await User.findOne({ phoneNumber: phoneNumWithCountryCode });

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new ApiResponse(200, { accessToken, refreshToken }));
});

const handleSocialLogin = catchAsync(async (req, res) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError("User does not exist", 400);
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { role: user.role, accessToken, refreshToken }));
});

const handleSocialLoginWithEmail = catchAsync(async (req, res) => {
  const user = await User.findOne({email:req.body.email});

  if (!user) {
    throw new ApiError("User does not exist", 400);
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { role: user.role,profileCompleted: user.profileCompleted, accessToken, refreshToken }));
});

const sendForgotPassOtp = catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError("Email address not found", 404);
  }

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    throw new ApiError("User does not exist", 404);
  }

  const randomInt = Math.floor(100000 + Math.random() * 900000);

  let otp = await Otp.findOne({ userId: user._id });

  if (!otp) {
    otp = await Otp.create({
      otp: randomInt,
      userId: user._id,
      expirationTime: otpExpirationTime,
    });
  }

  const currentTime = new Date();
  const requestTime = otp.requestTime;
  const elapsedTime = currentTime - requestTime;
  const elapsedMinutes = Math.floor(elapsedTime / (1000 * 60));

  const timeLeftInMinutes = Math.max(0, 60 - elapsedMinutes);

  if (otp.count === 5) {
    throw new ApiError(`Too many requests for OTPs, please try again after ${timeLeftInMinutes} minute(s)`, 400);
  }

  otp.otp = randomInt;
  otp.expirationTime = otpExpirationTime;
  otp.requestTime = new Date();
  ++otp.count;

  await otp.save({ validateBeforeSave: true });

  const mailOptions = { name: user.fullName, email: user.email, otp: otp.otp };

  sendForgotPasswordOtp(mailOptions);

  setTimeout(async () => {
    await Otp.findByIdAndDelete(otp._id);
  }, 100000);

  res.status(200).json(new ApiResponse("OTP sent to email"));
});

// const verifyForgotPassOtp = catchAsync(async (req, res) => {
//   const { otp } = req.body;

//   if (!otp) {
//     throw new ApiError("Otp not found", 404);
//   }

//   const existingOtp = await Otp.findOneAndDelete({ otp });

//   if (!existingOtp) {
//     throw new ApiError("Incorrect OTP", 400);
//   }

//   const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(existingOtp.userId);

//   const options = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//   };

//   return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new ApiResponse(200, { accessToken, refreshToken }));
// });

// const resetPassword = catchAsync(async (req, res) => {
//   const { password, passwordConfirm } = req.body;
//       console.log(req.body);
//   if (!password || !passwordConfirm) {
//     throw new ApiError("password or passwordConfirm not found", 404);
//   }

//   if (password !== passwordConfirm) {
//     throw new ApiError("Passwords are not same", 400);
//   }

//   const currentUser = await User.findById(req.user._id).select("-createdAt -updatedAt -__v -id");

//   currentUser.password = password;
//   currentUser.passwordConfirm = passwordConfirm;

//   await currentUser.save({ validateBeforeSave: true });

//   currentUser.password = undefined;

//   sendPasswordResetSuccessMail({ name: currentUser.fullName, email: currentUser.email });

//   res.status(200).json(new ApiResponse(200, currentUser));
// });


const verifyForgotPassOtp = catchAsync(async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    throw new ApiError("Otp not found", 404);
  }

  const existingOtp = await Otp.findOneAndDelete({ otp });

  if (!existingOtp) {
    throw new ApiError("Incorrect or expired OTP", 400);
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(existingOtp.userId);

  // Delete the OTP document after successful verification
  await Otp.findByIdAndDelete(existingOtp._id);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { accessToken, refreshToken }));
});

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const resetPassword = catchAsync(async (req, res) => {
  const { password, passwordConfirm } = req.body;

  if (!password || !passwordConfirm) {
    throw new ApiError("Password or passwordConfirm not found", 404);
  }

  if (password !== passwordConfirm) {
    throw new ApiError("Passwords do not match", 400);
  }

  // Find the user by ID
  const userId = req.user._id;
  console.log("User _id before password reset:", userId);

  // Hash the new password
  const hashedPassword = await hashPassword(password);

  // Update only the password field
  const result = await User.updateOne(
    { _id: userId },
    {
      $set: {
        password: hashedPassword,
      },
    }
  );

  console.log("User _id after password reset:", userId);

  if (result.nModified === 0) {
    // No documents were modified, possibly due to the same password
    throw new ApiError("Password not updated. Make sure it's different from the current password.", 400);
  }

  // Fetch the updated user after the update
  const currentUser = await User.findById(userId);


  sendPasswordResetSuccessMail({ name: currentUser.fullName, email: currentUser.email });

  res.status(200).json(new ApiResponse(200, currentUser));
});



export default { refreshAccessToken, registerUser, loginUser, loginWithOtp, verifyLoginOtp, handleSocialLogin, sendForgotPassOtp, verifyForgotPassOtp, resetPassword ,sendRegisterOtp,verifysendRegisterOtp,handleSocialLoginWithEmail };

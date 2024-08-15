import ArtistProfile from "../models/Artist/profile.model.js";
import User from "../models/user.model.js";
import Opportunity from "../models/opportunity.model.js";
import catchAsync from "../utils/catchAsync.js";
import ApiResponse from "../utils/ApiResponse.js";
import Application from "../models/application.model.js";
import ApiError from "../utils/ApiError.js";

import { deleteOne, getOne, uploadAvatar } from "./user.controllers.js";
import { getLocalPath, getStaticFilePath, removeLocalFile } from "../utils/helpers.js";

const getUser = getOne(ArtistProfile);

const deleteUser = deleteOne();

const updateAvatar = uploadAvatar();

const updateUser = catchAsync(async (req, res) => {
  req.user.firstName = req.body?.personalInfo?.firstName || req.user.firstName;
  req.user.lastName = req.body?.personalInfo?.lastName || req.user.lastName;
  req.user.email = req.body?.personalInfo?.email || req.user.email;
  req.user.phoneNumber = req.body?.personalInfo?.contactNumber || req.user.phoneNumber;
  req.user.profileCompleted = req.body?.profileCompleted;
  req.user.customID = req.body?.customID;




  req.user.address.city = req.body?.address?.city || req.user.address.city;
  req.user.address.state = req.body?.address?.state || req.user.address.state;
  req.user.address.pincode = req.body?.address?.pincode || req.user.address.pincode;

  req.user.socialLinks.facebook = req.body?.socialLinks?.facebook || req.user.socialLinks.facebook;
  req.user.socialLinks.instagram = req.body?.socialLinks?.instagram || req.user.socialLinks.instagram;
  req.user.socialLinks.linkedIn = req.body?.socialLinks?.linkedIn || req.user.socialLinks.linkedIn;
  req.user.socialLinks.website = req.body?.socialLinks?.website || req.user.socialLinks.website;
  req.user.socialLinks.twitter = req.body?.socialLinks?.twitter || req.user.socialLinks.twitter;
  req.user.socialLinks.youtube = req.body?.socialLinks?.youtube || req.user.socialLinks.youtube;

  await req.user.save({ validateBeforeSave: false });

  const update = {
    "personalInfo.about": req.body?.personalInfo?.about,
    "personalInfo.age": req.body?.personalInfo?.age,
    "personalInfo.gender": req.body?.personalInfo?.gender,
    "personalInfo.incomeSrc": req.body?.personalInfo?.incomeSrc,
    "personalInfo.socialCategory": req.body?.personalInfo?.socialCategory,
    "personalInfo.pwd": req.body?.personalInfo?.pwd,
    "personalInfo.languages": req.body?.personalInfo?.languages,
    "personalInfo.annualIncome": req.body?.personalInfo?.annualIncome,

    "otherInfo.primaryIncomeSrc": req.body?.otherInfo?.primaryIncomeSrc,
    "otherInfo.anunalIncomeByPerf": req.body?.otherInfo?.anunalIncomeByPerf,
    "otherInfo.idProof.name": req.body?.otherInfo?.idProof?.name,
    "otherInfo.idProof.num": req.body?.otherInfo?.idProof?.num,
    "otherInfo.gstIn": req.body?.otherInfo?.gstIn,
    "otherInfo.passportNumber": req.body?.otherInfo?.passportNumber,
    "otherInfo.panNumber": req.body?.otherInfo?.panNumber,
    "otherInfo.upiId": req.body?.otherInfo?.upiId,
    "otherInfo.highestEducation": req.body?.otherInfo?.highestEducation,
    "otherInfo.yearOfCompletion": req.body?.otherInfo?.yearOfCompletion,
    "otherInfo.profileUrl": req.body?.otherInfo?.profileUrl,

    "artInfo.aboutArt": req.body?.artInfo?.aboutArt,
    "artInfo.artCategory": req.body?.artInfo?.artCategory,
    "artInfo.artName": req.body?.artInfo?.artName,
    "artInfo.artType": req.body?.artInfo?.artType,
    "artInfo.artEducation": req.body?.artInfo?.artEducation,
    "artInfo.artDocuments": req.body?.artInfo?.artDocuments,
    
    traditionalInfo: req.body?.traditionalInfo,

    professionalInfo: req.body?.professionalInfo,

    "performanceInfo.perfType": req.body?.performanceInfo?.perfType,
    "performanceInfo.experience": req.body?.performanceInfo?.experience,
    "performanceInfo.highestPerfLevel": req.body?.performanceInfo?.highestPerfLevel,
    "performanceInfo.affiliation.isAffiliated": req.body?.performanceInfo?.affiliation?.isAffiliated,
    "performanceInfo.affiliation.name": req.body?.performanceInfo?.affiliation?.name,
    "performanceInfo.affiliation.location": req.body?.performanceInfo?.affiliation?.location,
    "performanceInfo.affiliation.contactNumber": req.body?.performanceInfo?.affiliation?.contactNumber,
    "performanceInfo.perfDetails": req.body?.performanceInfo?.perfDetails,
    "performanceInfo.totalPerfs": req.body?.performanceInfo?.totalPerfs,
    "performanceInfo.highlights": req.body?.performanceInfo?.highlights,
    "performanceInfo.peakPerf": req.body?.performanceInfo?.peakPerf,
    "performanceInfo.perfDuration.india": req.body?.performanceInfo?.perfDuration?.india,
    "performanceInfo.perfDuration.international": req.body?.performanceInfo?.perfDuration?.international,
    "performanceInfo.perfCharge.india": req.body?.performanceInfo?.perfCharge?.india,
    "performanceInfo.perfCharge.international": req.body?.performanceInfo?.perfCharge?.international,
    "performanceInfo.majorPerfCity": req.body?.performanceInfo?.majorPerfCity,
    "performanceInfo.majorPerfCountry": req.body?.performanceInfo?.majorPerfCountry,
    "performanceInfo.perfImgs": req.body?.performanceInfo?.perfImgs,
    "performanceInfo.perfVideos": req.body?.performanceInfo?.perfVideos,
    "performanceInfo.PerformanceInfo": req.body?.performanceInfo?.performanceInfo,
    "performanceInfo.performances": req.body?.performanceInfo?.performances,
    "performanceInfo.performanceDocuments":req.body?.performanceInfo?.performanceDocuments,

    "awardsInfo.totalAwards": req.body?.awardsInfo?.totalAwards,
    "awardsInfo.level": req.body?.awardsInfo?.level,
    "awardsInfo.awardsDetails": req.body?.awardsInfo?.awardsDetails,
    "awardsInfo.highlights": req.body?.awardsInfo?.highlights,
    "awardsInfo.awardDocuments": req.body?.awardsInfo?.awardDocuments,
  };

  let user = await ArtistProfile.findByIdAndUpdate(req.user._id, update, { new: true, runValidators: true });

  user = { ...user.toObject() };

  user.personalInfo.avatar = req.user.avatar;
  user.personalInfo.firstName = req.user.firstName;
  user.personalInfo.lastName = req.user.lastName;
  user.personalInfo.contactNumber = req.user.phoneNumber;
  user.personalInfo.email = req.user.email;
  user.profileCompleted = req.user.profileCompleted;
  user.personalInfo.customID = req.user.customID;

  user.address = req.user.address;
  user.socialLinks = req.user.socialLinks;

  user.appliedOpportunities = req.user.appliedOpportunities;
  user.savedOpportunities = req.user.savedOpportunities;

  res.status(200).json(new ApiResponse(200, user));
});
// const updatePerformanceImages = catchAsync(async (req, res) => {
//   if (!req.files) {
//     throw new ApiError("Images are required", 400);
//   }
// });

const applyForOpportunity = catchAsync(async (req, res) => {
  const { id } = req.params;
   
  if(req.user.isBlocked){
    res.send({message: "You are Blocked"});
  }
  else{
    
  if (!id) {
    throw new ApiError("Please provide an id in query", 404);
  }

  const opportunity = await Opportunity.findById(id);

  if (!opportunity) {
    throw new ApiError("Opportunity not found", 404);
  }

  if(opportunity.isBlocked){
    throw new ApiError("opportunity is blocked");
  }

  if (req.user.appliedOpportunities.includes(opportunity.id)) {
    throw new ApiError("Already applied for this opportunity", 400);
  }

  const application = await Application.create({
    appliedBy: req.user._id,
    opportunity: id,
    postedBy: opportunity.userId,
    answer: req.body?.answer,
    quotedPrice: req.body.quotedPrice,
  });

  if (!application) {
    throw new ApiError("Unable to apply, please try again", 500);
  }

  req.user.appliedOpportunities.push(application.opportunity);

  await req.user.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, { message: "Applied successfully" }));
  }
});

const getAppliedApplications = catchAsync(async (req, res) => {
  const { status } = req.query;

  const filter = { appliedBy: req.user._id, status };

  !status && delete filter.status;

  const applications = await Application.find(filter, { postedBy: 0, answer: 0, appliedBy: 0 }).populate({
    path: "opportunity",
  });

  res.status(200).json(new ApiResponse(200, applications));
});

// save opportunity
const saveOpportunity = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError("Please provide an id in query", 404);
  }

  const opportunity = await Opportunity.findById(id);

  if (!opportunity) {
    throw new ApiError("Opportunity not found", 404);
  }

  if (req.user.savedOpportunities.includes(opportunity.id)) {
    throw new ApiError("Opportunity is already saved", 400);
  }

  req.user.savedOpportunities.push(opportunity.id);

  await req.user.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, { message: "Opportunity saved successfully" }));
});

const unSaveOpportunity = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError("Please provide an id in query", 404);
  }

  const opportunity = await Opportunity.findById(id);

  if (!opportunity) {
    throw new ApiError("Opportunity not found", 404);
  }

  const index = req.user.savedOpportunities.indexOf(opportunity.id);

  if (index < 0) {
    throw new ApiError("Opportunity is not saved yet", 400);
  } else {
    req.user.savedOpportunities.splice(index, 1);
  }

  await req.user.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, { message: "Opportunity unsaved successfully" }));
});

const savedOpportunities = catchAsync(async (req, res) => {
  const { savedOpportunities } = await User.findById(req.user.id, { savedOpportunities: 1 }).populate("savedOpportunities");

  res.status(200).json(new ApiResponse(200, savedOpportunities));
});

// const updatePerfImages = catchAsync(async (req, res) => {
//   if (req.files?.length === 0) {
//     throw new ApiError("Performance images are required", 400);
//   }

//   const images = req.files.map((file) => getStaticFilePath(req, file?.filename));

//   const { performanceInfo } = await ArtistProfile.findByIdAndUpdate(req.user._id, {
//     // $set: {
//     //   performanceInfo: {
//     //     perfImgs: images,
//     //   },
//     $push: {
//       'performanceInfo.perfImgs': { $each: images },
//     },},{ new: true });

//   performanceInfo.perfImgs.forEach((img) => removeLocalFile(getLocalPath(img.split("/").pop())));

//   return res.status(200).json(new ApiResponse(200, { performanceInfo: { perfImgs: images } }));
// });

const updatePerfImages = catchAsync(async (req, res) => {
  if (req.files?.length === 0) {
    throw new ApiError("Performance images are required", 400);
  }

  const existingImages = await ArtistProfile.findById(req.user._id).select('performanceInfo.perfImgs');

  const images = req.files.map((file) => getStaticFilePath(req, file?.filename));
  const newImages = [...existingImages?.performanceInfo?.perfImgs, ...images];

  const { performanceInfo } = await ArtistProfile.findByIdAndUpdate(req.user._id, {
    $set: {
      performanceInfo: {
        perfImgs: newImages,
      },
    },
  }, { new: true });

  newImages.forEach((img) => removeLocalFile(getLocalPath(img.split("/").pop())));

  return res.status(200).json(new ApiResponse(200, { performanceInfo: { perfImgs: newImages } }));
});



// const updatePerfVideos = catchAsync(async (req, res) => {
//   if (req.files?.length === 0) {
//     throw new ApiError("Performance videos are required", 400);
//   }

//   const videos = req.files.map((file) => getStaticFilePath(req, file?.filename));

//   const { performanceInfo } = await ArtistProfile.findByIdAndUpdate(req.user._id, {
//     $set: {
//       performanceInfo: {
//         perfVideos: videos,
//       },
//     },
//   });

//   performanceInfo.perfVideos.forEach((img) => removeLocalFile(getLocalPath(img.split("/").pop())));

//   return res.status(200).json(new ApiResponse(200, { performanceInfo: { perfVideos: videos } }));
// });

const updatePerfVideos = catchAsync(async (req, res) => {
  if (!req.body.videoUrls || req.body.videoUrls.length === 0) {
    throw new ApiError("Performance video URLs are required", 400);
  }

  const videoUrls = req.body.videoUrls; // Assuming videoUrls is an array of video URLs or paths

  // Update performanceInfo field with video URLs
  const { performanceInfo } = await ArtistProfile.findByIdAndUpdate(req.user._id, {
    $set: {
      performanceInfo: {
        perfVideos: videoUrls,
      },
    // $push: {
    //   'performanceInfo.perfVideos': { $each: [videoUrls] },
    // },
    
  },});
  // No need to remove any local files as we're dealing with URLs

  return res.status(200).json(new ApiResponse(200, { performanceInfo: { perfVideos: videoUrls } }));
});


//new fields controller functions=
const getHighestEducation = catchAsync(async (req, res) => {
  const artist = await ArtistProfile.findById(req.user.id);
  res.status(200).json({
    highestEducation: artist.highestEducation,
    yearOfCompletion: artist.yearOfCompletion,
  });
});



const updateHighestEducation = catchAsync(async (req, res) => {
  const { highestEducation, yearOfCompletion } = req.body;

  
  const updatedProfile = await ArtistProfile.findByIdAndUpdate(
    req.user.id,
    { highestEducation, yearOfCompletion },
    { new: true } 
  );

  
  if (!updatedProfile) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  res.status(200).json({ profile: updatedProfile });
});



const getBankAccountDetails = catchAsync(async (req, res) => {
  const artist = await ArtistProfile.findById(req.user.id);
  res.status(200).json({
    bankAccountNumber: artist.bankAccountNumber,
    nameOfBank: artist.nameOfBank,
    ifscCode: artist.ifscCode,
    bankBranchLocation: artist.bankBranchLocation,
  });
});

const updateBankAccountDetails = catchAsync(async (req, res) => {
  const { bankAccountNumber, nameOfBank, ifscCode, bankBranchLocation } = req.body;
  await ArtistProfile.findByIdAndUpdate(req.user.id, {
    bankAccountNumber,
    nameOfBank,
    ifscCode,
    bankBranchLocation,
  });
  res.sendStatus(204);
});


//new fields
const updatePerformanceInfo = catchAsync(async (req, res) => {
  const { performances } = req.body;

  const artistProfile = await ArtistProfile.findById(req.user._id);


  artistProfile.performanceInfo.performances = performances;

  await artistProfile.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, { message: "Performance information updated successfully" }));
});

//new for document upload

const uploadArtDocuments = catchAsync(async (req, res) => {
  const uploadedArtDocuments = req.body.artDocuments; 
  if (req.files?.length === 0) {
    throw new ApiError("Art Documents are required", 400);
  }

  const images = req.files.map((file) => getStaticFilePath(req, file?.filename));


  const updatedProfile = await ArtistProfile.findByIdAndUpdate(
    req.user._id,
    { $push: { "artInfo.artDocuments": { $each: images } } },
    { new: true }
  );
  // updatedProfile.artInfo.artDocuments.forEach((img) => removeLocalFile(getLocalPath(img.split("/").pop())));

  res.status(200).json({ message: "Art documents uploaded successfully", profile: updatedProfile,images:images });
});

const uploadPerformanceDocuments = catchAsync(async (req, res) => {
  const uploadedPerformanceDocuments = req.body.performanceDocuments;
  if (req.files?.length === 0) {
    throw new ApiError("Art Documents are required", 400);
  }

  const images = req.files.map((file) => getStaticFilePath(req, file?.filename));

  const updatedProfile = await ArtistProfile.findByIdAndUpdate(
    req.user._id,
    { $push: { "performanceInfo.performanceDocuments": { $each: images } } },
    { new: true }
  );
  // updatedProfile.performanceInfo.performanceDocuments.forEach((img) => removeLocalFile(getLocalPath(img.split("/").pop())));
  res.status(200).json({ message: "Performance documents uploaded successfully", profile: updatedProfile,images:images });
});

const uploadAwardDocuments = catchAsync(async (req, res) => {
  const uploadedAwardDocuments = req.body.awardDocuments;

  if (req.files?.length === 0) {
    throw new ApiError("Art Documents are required", 400);
  }

  const images = req.files.map((file) => getStaticFilePath(req, file?.filename));

  const updatedProfile = await ArtistProfile.findByIdAndUpdate(
    req.user._id,
    { $push: { "awardsInfo.awardDocuments": { $each: images } } },
    { new: true }
  );

  res.status(200).json({ message: "Award documents uploaded successfully", profile: updatedProfile });
});

const uploadDocuments = catchAsync(async (req, res) => {
  if (req.files?.length === 0) {
    throw new ApiError("Art Documents are required", 400);
  }

  const images = req.files.map((file) => getStaticFilePath(req, file?.filename));
  res.status(200).json({ message: "Documents uploaded successfully", images: images });
})
export default {
  getUser,
  updateUser,
  deleteUser,
  updateAvatar,
  applyForOpportunity,
  getAppliedApplications,
  saveOpportunity,
  unSaveOpportunity,
  savedOpportunities,
  updatePerfImages,
  updatePerfVideos,
  getHighestEducation,
  updateHighestEducation,
  getBankAccountDetails,
  updateBankAccountDetails,
  updatePerformanceInfo,
  
  uploadArtDocuments,
  uploadPerformanceDocuments,
  uploadAwardDocuments,
  uploadDocuments
};

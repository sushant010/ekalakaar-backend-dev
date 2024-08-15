import ArtistProfile from "../models/Artist/profile.model.js";
import PatronProfile from "../models/Patron/profile.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import catchAsync from "../utils/catchAsync.js";
import { deleteOne, getOne, uploadAvatar } from "./user.controllers.js";

const getUser = getOne(PatronProfile);

const deleteUser = deleteOne();

const updateAvatar = uploadAvatar();

const updateUser = catchAsync(async (req, res) => {
  req.user.firstName = req.body?.personalInfo?.firstName || req.user.firstName;
  req.user.lastName = req.body?.personalInfo?.lastName || req.user.lastName;
  req.user.phoneNumber = req.body?.contactDetails?.contactNumber || req.user.phoneNumber;

  req.user.address.state = req.body?.address?.state || req.user.address.state;
  req.user.address.city = req.body?.address?.city || req.user.address.city;
  req.user.address.pincode = req.body?.address?.pincode || req.user.address.pincode;
  req.user.address.details = req.body?.address?.details || req.user.address.details;

  req.user.contactDetails.contactNumber = req.user.phoneNumber;
  req.user.contactDetails.email = req.body?.contactDetails?.email || req.user.contactDetails.email;
  req.user.contactDetails.website = req.body?.contactDetails?.website || req.user.contactDetails.website;
  req.user.contactDetails.expectations = req.body?.contactDetails?.expectations || req.user.contactDetails.expectations;

  await req.user.save({ validateBeforeSave: false });

  const update = {
    "personalInfo.profession": req.body?.personalInfo?.profession,
    "personalInfo.companyName": req.body?.personalInfo?.companyName,
    "personalInfo.authorizedPerson": req.body?.personalInfo?.authorizedPerson,
    "personalInfo.designation": req.body?.personalInfo?.designation,
    "personalInfo.companyDescription": req.body?.personalInfo?.companyDescription,
  };

  let user = await PatronProfile.findByIdAndUpdate(req.user._id, update, { new: true, runValidators: true });

  user = { ...user.toObject() };

  user.personalInfo.firstName = req.user.firstName;
  user.personalInfo.lastName = req.user.lastName;

  user.address = req.user.address;
  user.contactDetails = req.user.contactDetails;

  res.status(200).json(new ApiResponse(200, user));
});

const getArtistProfiles = catchAsync(async (req, res) => {
  let artists = await User.find({ role: "Artist" });

  artists = await Promise.all(
    artists.map(async (artist) => {
      let artistProfile = await ArtistProfile.findById(artist._id);

      artistProfile = { ...artistProfile.toObject() };

      artistProfile.personalInfo.avatar = artist.avatar;
      artistProfile.personalInfo.firstName = artist.firstName;
      artistProfile.personalInfo.lastName = artist.lastName;
      artistProfile.personalInfo.email = artist.email;
      artistProfile.personalInfo.contactNumber = artist.phoneNumber;

      artistProfile.address = artist.address;

      artistProfile.socialLinks = artist.socialLinks;

      return artistProfile;
    })
  );

  res.status(200).json(new ApiResponse(200, artists));
});

const getArtistProfile = catchAsync(async (req, res) => {
  const { id } = req.params;

  let artist = await User.findOne({ _id: id, role: "Artist" });

  if (!artist) {
    throw new ApiError("Artist not found", 404);
  }

  let artistProfile = await ArtistProfile.findById(artist._id);

  artistProfile = { ...artistProfile.toObject() };

  artistProfile.personalInfo.avatar = artist.avatar;
  artistProfile.personalInfo.firstName = artist.firstName;
  artistProfile.personalInfo.lastName = artist.lastName;
  artistProfile.personalInfo.email = artist.email;
  artistProfile.personalInfo.contactNumber = artist.phoneNumber;

  artistProfile.address = artist.address;

  artistProfile.socialLinks = artist.socialLinks;

  res.status(200).json(new ApiResponse(200, artistProfile));
});

// const getArtistProfiles = catchAsync(async (req, res) => {
//   let dataOne, dataTwo;

//   if (req.query.id) {
//     dataOne = await User.findById(req.query.id);

//     if (!dataOne) {
//       throw new ApiError("Artist not found", 404);
//     }

//     dataTwo = await ArtistProfile.findById(dataOne._id);

//     dataTwo.personalInfo.avatar = dataOne.avatar;
//     dataTwo.personalInfo.firstName = dataOne.firstName;
//     dataTwo.personalInfo.lastName = dataOne.lastName;
//     dataTwo.personalInfo.email = dataOne.email;
//     dataTwo.personalInfo.contactNumber = dataOne.phoneNumber;

//     dataTwo.address = dataOne.address;

//     dataTwo.socialLinks = dataOne.socialLinks;
//   } else {
//     dataTwo = await ArtistProfile.find({}).populate("_id");
//   }

//   if (!dataTwo.length) {
//     // const data = { ...dataOne.toObject(), ...dataTwo.toObject() };
//     res.status(200).json(new ApiResponse(200, dataTwo));
//   } else {
//     res.status(200).json(new ApiResponse(200, dataTwo));
//   }
// });

export default { getUser, updateUser, deleteUser, updateAvatar, getArtistProfiles, getArtistProfile };

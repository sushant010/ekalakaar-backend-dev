import User from "../models/user.model.js";
import ProfileArtist from "../models/Artist/profile.model.js";
import ProfilePatron from "../models/Patron/profile.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import Application from "../models/application.model.js";
import Opportunity from "../models/opportunity.model.js";

const getUsers = catchAsync(async (req, res) => {
  const { role } = req.query;
  
  if(role === "Artist"){
    const ausers = await ProfileArtist.find();
    const users = await User.find({role: role});

    const mergedUsers = users.map(user => {
      const matchingProfilePatron = ausers.find(auser => auser._id.toString() === user._id.toString());

      if (matchingProfilePatron) {
          return {
            ...user.toObject(),
            ...matchingProfilePatron.toObject()
          };
      } else {
        return {
          ...user.toObject(),
        };
      }
});

    res.status(200).json(new ApiResponse(200, mergedUsers));
  }
  else if(role === "Patron"){
    const users = await User.find({role: role});
    const pusers = await ProfilePatron.find();

    const mergedUsers = users.map(user => {
      const matchingProfilePatron = pusers.find(puser => puser._id.toString() === user._id.toString());

      if (matchingProfilePatron) {
          return {
            ...user.toObject(),
            ...matchingProfilePatron.toObject()
          };
      } else {
        return {
          ...user.toObject(),
        };
      }
});

    res.status(200).json(new ApiResponse(200, mergedUsers));

  }
  else {
    const users = await User.find({role: role});
    res.status(200).json(new ApiResponse(200, users));
  }
 
});

const getUserById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  let profileData;

  if (user.role === "Artist") {
    profileData = await ProfileArtist.findById(user._id);
     
    // profileData = { 
    //   ...user.toObject(),
    //   ...profileData, };

    // if (!profileData) {
    //   throw new ApiError("Profile data not found", 404);
    // }

    // profileData.personalInfo.avatar = user.avatar;
    // profileData.personalInfo.firstName = user.firstName;
    // profileData.personalInfo.lastName = user.lastName;
    // profileData.personalInfo.email = user.email;
    // profileData.personalInfo.contactNumber = user.phoneNumber;

    // profileData.address = user.address;

    // profileData.socialLinks = user.socialLinks;

    // profileData.appliedOpportunities = user.appliedOpportunities;
    // profileData.savedOpportunities = user.savedOpportunities;
  }

  if (user.role === "Patron") {
    profileData = await ProfilePatron.findById(user._id);

    // profileData = { ...profileData.toObject() };

    // if (!profileData) {
    //   throw new ApiError("Profile data not found", 404);
    // }

    // profileData.personalInfo.avatar = user.avatar;
    // profileData.personalInfo.firstName = user.firstName;
    // profileData.personalInfo.lastName = user.lastName;

    // profileData.address = user.address;
    // profileData.contactDetails = user.contactDetails;
  }
  profileData = {
    ...user.toObject(),
    ...profileData,
  }
  res.status(200).json(new ApiResponse(200, profileData));
});

const updateUserById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const updatedDataOne = await User.findByIdAndUpdate(
    id,
    {
      $set: {
        firstName: req.body?.["personalInfo.firstName"],
        lastName: req.body?.["personalInfo.lastName"],
        phoneNumber: req.body?.["personalInfo.contactNumber"],
        "address.state": req.body?.["address.state"],
        "address.city": req.body?.["address.city"],
        "address.pincode": req.body?.["address.pincode"],
        "address.details": req.body?.["address.details"],
        "socialLinks.instagram": req.body?.["socialLinks.instagram"],
        "socialLinks.facebook": req.body?.["socialLinks.facebook"],
        "socialLinks.youtube": req.body?.["socialLinks.youtube"],
        "socialLinks.linkedIn": req.body?.["socialLinks.linkedIn"],
        "socialLinks.website": req.body?.["socialLinks.website"],
        contactDetails: req.body?.contactDetails,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedDataOne) {
    throw new ApiError("User not found", 404);
  }

  let updatedDataTwo;

  if (updatedDataOne.role === "Artist") {
    updatedDataTwo = await ProfileArtist.findByIdAndUpdate(
      updatedDataOne._id,
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedDataTwo) {
      throw new ApiError("User not found", 404);
    }

    updatedDataTwo = { ...updatedDataTwo.toObject() };

    updatedDataTwo.personalInfo.avatar = updatedDataOne.avatar;
    updatedDataTwo.personalInfo.firstName = updatedDataOne.firstName;
    updatedDataTwo.personalInfo.lastName = updatedDataOne.lastName;
    updatedDataTwo.personalInfo.email = updatedDataOne.email;
    updatedDataTwo.personalInfo.contactNumber = updatedDataOne.phoneNumber;

    updatedDataTwo.address = updatedDataOne.address;

    updatedDataTwo.socialLinks = updatedDataOne.socialLinks;

    updatedDataTwo.appliedOpportunities = updatedDataOne.appliedOpportunities;
    updatedDataTwo.savedOpportunities = updatedDataOne.savedOpportunities;
  }

  if (updatedDataOne.role === "Patron") {
    updatedDataTwo = await ProfilePatron.findByIdAndUpdate(
      updatedDataOne._id,
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedDataTwo) {
      throw new ApiError("User not found", 404);
    }

    updatedDataTwo = { ...updatedDataTwo.toObject() };

    updatedDataTwo.personalInfo.avatar = updatedDataOne.avatar;
    updatedDataTwo.personalInfo.firstName = updatedDataOne.firstName;
    updatedDataTwo.personalInfo.lastName = updatedDataOne.lastName;

    updatedDataTwo.address = updatedDataOne.address;
    updatedDataTwo.contactDetails = updatedDataOne.contactDetails;
  }

  res.status(200).json(new ApiResponse(200, updatedDataTwo));
});

const getArtistApplications = catchAsync(async (req, res) => {
  const { id } = req.params;

  const applications = await Application.find({ appliedBy: id }, { postedBy: 0, answer: 0, appliedBy: 0 }).populate({
    path: "opportunity",
    select: "position description artNature category location performanceDate budget languages applicationPeriod",
  });

  res.status(200).json(new ApiResponse(200, applications));
});

const postOpps = async(req, res) =>{
   try {
    const userId = req.user.id;
     const data = req.body;
     data.userId = userId;
     const newopp = await Opportunity.create(data);
     res.status(201).json(newopp);
   } catch (error) {
    res.status(500).json(error);
   }
}

const updateOpps = async(req, res) =>{
   try {
     const data = req.body;
     const id = req.query.id;

     const updatedopp = await Opportunity.findByIdAndUpdate(
      id,
      { $set: data }, 
      { new: true }
     );

     res.status(200).json(updatedopp);
   } catch (error) {
     res.status(500).json(error);
   }
}

const deleteOpps = async(req, res) =>{
  try {
    const id = req.query.id;
    const deletedopp = await Opportunity.findByIdAndDelete(
     id
    );
    res.status(200).json({message: "opportunity deleted successfully", deletedopp});
  } catch (error) {
    res.status(500).json(error);
  }
}
const updateAppStatus = async(req, res) =>{

  try {
    const id = req.query.id;
    const data = req.body;
    const updatedStatus = await Application.findByIdAndUpdate(
      id, 
      { $set: data }, 
      { new: true }
      ).populate({ path: "opportunity appliedBy" })
      res.status(200).json(updatedStatus);
  } catch (error) {
    res.status(500).json(error);
  }
}

export default { getUsers, getUserById, updateUserById, getArtistApplications, postOpps, updateOpps, deleteOpps, updateAppStatus };

import { getLocalPath, getStaticFilePath, removeLocalFile } from "../utils/helpers.js";
import User from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";

const getOne = (Model) =>
  catchAsync(async (req, res) => {
    const userId = req.params.userId;
    if(userId){
      const user = await User.findById(userId).select("+role +avatar +refreshToken");
      if(user){
        req.user = user;
      }else{
        throw new ApiError("User Data is not found",400)  
      }
    }
    let data = await Model.findById(req.user._id);
    data = { ...data.toObject() };

    if (req.user.role === "Artist") {
      data.personalInfo.avatar = req.user.avatar;
      data.personalInfo.firstName = req.user.firstName;
      data.personalInfo.lastName = req.user.lastName;
      data.personalInfo.email = req.user.email;
      data.personalInfo.contactNumber = req.user.phoneNumber;
      data.profileCompleted = req.user.profileCompleted;
      data.personalInfo.customID= req.user.customID;
      data.address = req.user.address;

      data.socialLinks = req.user.socialLinks;

      data.appliedOpportunities = req.user.appliedOpportunities;
      data.savedOpportunities = req.user.savedOpportunities;
      data.performanceInfo.prefInside = [
        getStaticFilePath(req,'pref_1.png'),
        getStaticFilePath(req,'pref_2.png'),
        getStaticFilePath(req,'pref_3.png'),
        getStaticFilePath(req,'pref_4.png'),
      ];
      data.otherInfo.user_rating = 4.5;
      data.testimonals = [
        {
          image:getStaticFilePath(req,"testimonal_user.png"),
          rating:5,
          text:"Deene is one of the good dancer who always focus on practice. His moves and styles are great, and I am happy to be his mentor."
        },
        {
          image:getStaticFilePath(req,"testimonal_user.png"),
          rating:5,
          text:"Deene is one of the good dancer who always focus on practice. His moves and styles are great, and I am happy to be his mentor."
        }
      ]
    }

    if (req.user.role === "Patron") {
      data.personalInfo.avatar = req.user.avatar;
      data.personalInfo.firstName = req.user.firstName;
      data.personalInfo.lastName = req.user.lastName;
      data.personalInfo.customID= req.user.customID;
      data.address = req.user.address;
      data.contactDetails = req.user.contactDetails;
      data.contactDetails.contactNumber = req.user.phoneNumber;
    }

    res.status(200).json(new ApiResponse(200, data));
  });

const deleteOne = () =>
  catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id);

    await user.deleteUser(req.user._id);

    res.status(204).json(new ApiResponse(204, null));
  });

const uploadAvatar = () =>
  catchAsync(async (req, res) => {
    req.file = req.files[0];

    if (!req.file) {
      throw new ApiError("Avatar image is required", 400);
    }

    const avatarUrl = getStaticFilePath(req, req.file?.filename);
    const avatarLocalPath = getLocalPath(req.file?.filename);

    let { avatar } = await User.findByIdAndUpdate(
      req.user._id,

      {
        $set: {
          avatar: {
            url: avatarUrl,
            localPath: avatarLocalPath,
          },
        },
      },
      { new: true }
    );

    removeLocalFile(req.user.avatar.localPath);

    return res.status(200).json(new ApiResponse(200, { avatar }));
  });

  const UpdateUser = async (req, res) => {
    try {
      const data = req.body;
      const userId = req.params.id;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: data }, 
        { new: true },
      );
  
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json(error);
    }
  };

  const DeleteUser = async(req,res) =>{
    try {
      const id = req.params.id;
      const deletedUser = await User.findByIdAndDelete(id);
      res.status(200).json(deletedUser);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  
export { getOne, deleteOne, uploadAvatar, UpdateUser, DeleteUser };
import catchAsync from "../utils/catchAsync.js";
import ApiResponse from "../utils/ApiResponse.js";
import Application from "../models/application.model.js";
import ArtistProfile from "../models/Artist/profile.model.js";
import ApiError from "../utils/ApiError.js";

// Patron Specific

const getPatronApplications = catchAsync(async (req, res) => {
  const { opportunityId, status } = req.query;

  const filter = { postedBy: req.user._id, status, opportunity: opportunityId };

  !opportunityId && delete filter.opportunity;

  !status && delete filter.status;

  let applications = await Application.find(filter).populate({ path: "opportunity appliedBy" });

  applications = await Promise.all(
    applications.map(async (app) => {
      const newApp = { ...app.toObject() };

      const { artInfo } = await ArtistProfile.findById(app.appliedBy);

      newApp.artNature = artInfo?.artNature;

      return newApp;
    })
  );

  res.status(200).json(new ApiResponse(200, applications));
});

// const getPatronApplication = catchAsync(async (req, res) => {
//   const { id } = req.params;

//   const application = await Application.findOne({ _id: id, postedBy: req.user._id }).populate({ path: "opportunity appliedBy" });

//   if (!application) {
//     throw new ApiError("Application not found", 404);
//   }

//   res.status(200).json(new ApiResponse(200, application));
// });

const getPatronApplication = catchAsync(async (req, res) => {
  const { opportunityId, status } = req.query;

  const filter = { postedBy: req.user._id, status };

  // Filter out expired or deleted opportunities
  filter.opportunity = { $ne: null, $nin: [null, undefined] };  // Ensure opportunity exists
  filter.opportunity.$or = [
    { isExpired: false },
    { isDeleted: false }
  ];

  !opportunityId && delete filter.opportunity;
  !status && delete filter.status;

  let applications = await Application.find(filter).populate({ path: "opportunity appliedBy" });

  applications = await Promise.all(
    applications.map(async (app) => {
      const newApp = { ...app.toObject() };

      const { artInfo } = await ArtistProfile.findById(app.appliedBy);

      newApp.artNature = artInfo?.artNature;

      return newApp;
    })
  );

  res.status(200).json(new ApiResponse(200, applications));
});

const updatePatronApplication = catchAsync(async (req, res) => {
  const { id } = req.params;

  const { status } = req.body;

  const updatedApplication = await Application.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }).populate({ path: "opportunity appliedBy" });

  if (!updatedApplication) {
    throw new ApiError("Application not found", 404);
  }

  res.status(200).json(new ApiResponse(200, updatedApplication));
});

// const deletePatronApplication = catchAsync(async (req, res) => {
//   const { id } = req.params;

//   const deletedApplication = await Application.findByIdAndDelete(id);

//   if (!deletedApplication) {
//     throw new ApiError("Application not found", 404);
//   }

//   await User.findByIdAndUpdate(deletedApplication._id, { $pull: { appliedOpportunities: deletedOpportunity.id } });

//   res.status(204).json(new ApiResponse(204, deletedApplication));
// });

const getOppApps = async (req, res) => {
  try {
    const app = await Application.find({opportunity: req.query.opportunityId}).populate({ path: "opportunity appliedBy" });
    res.status(200).json(app);
  } catch (error) {
    res.status(500).json(error);
  }
}

const getAllApps = async (req, res) => {

  try {
    const app = await Application.find().populate({ path: "opportunity appliedBy" });
    res.status(200).json(app);
  } catch (error) {
    res.status(500).json(error);
  }
}

export default { getPatronApplications, getPatronApplication, updatePatronApplication /*deletePatronApplication*/, getAllApps, getOppApps };
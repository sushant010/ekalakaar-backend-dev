import User from "../models/user.model.js";
import Opportunity from "../models/opportunity.model.js";
import catchAsync from "../utils/catchAsync.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import Application from "../models/application.model.js";

// Patron Specific

const getPatronOpps = catchAsync(async (req, res) => {
  const patronOpps = await Opportunity.find({ userId: req.user.id }).setOptions({ includeAll: true }).sort("-createdAt");

  res.status(200).json(new ApiResponse(200, patronOpps));
});

const createPatronOpportunity = catchAsync(async (req, res) => {
   if(req.user.isBlocked){
      res.send({message: 'You are not allowed to post opportunities, because your are blocked. Please contact to administrator'})
   }
   else{
    const newOpportunity = await Opportunity.create({ ...req.body, postedBy: req.user.fullName, userId: req.user._id });

  // const newOpportunity = await Promise.all(
  //   req.body.map(async (opp) => {
  //     return await Opportunity.create({ ...opp, postedBy: req.user.fullName, userId: req.user._id });
  //   })
  // );

  if (!newOpportunity) {
    throw new ApiError("Unable to create opportunity");
  }

  res.status(201).json(new ApiResponse(201, newOpportunity));
   }
});

const getPatronOpportunity = catchAsync(async (req, res) => {
  const { id } = req.params;

  const opportunity = await Opportunity.findOne({ _id: id, userId: req.user.id }).setOptions({ includeAll: true });

  if (!opportunity) {
    throw new ApiError("Opportunity not found", 404);
  }

  res.status(200).json(new ApiResponse(200, opportunity));
});

const updatePatronOpportunity = catchAsync(async (req, res) => {
  const { id } = req.params;

  req.body.userId && delete req.body.userId;

  const updatedOpportunity = await Opportunity.findOneAndUpdate({ _id: id, userId: req.user.id }, req.body, { new: true, runValidators: true }).setOptions({ includeAll: true });

  if (!updatedOpportunity) {
    throw new ApiError("Opportunity not found", 404);
  }

  res.status(200).json(new ApiResponse(200, updatedOpportunity));
});

const deletePatronOpportunity = catchAsync(async (req, res) => {
  const { id } = req.params;

  const deletedOpportunity = await Opportunity.findOneAndDelete({ _id: id, userId: req.user.id }).setOptions({ includeAll: true });

  if (!deletedOpportunity) {
    throw new ApiError("Opportunity not found", 404);
  }

  // also deleting the data belonging to this particular opportunity

  await Application.deleteMany({ opportunity: deletedOpportunity.id });

  await User.updateMany(
    { $or: [{ savedOpportunities: deletedOpportunity.id }, { appliedOpportunities: deletedOpportunity.id }] },
    { $pull: { savedOpportunities: deletedOpportunity.id, appliedOpportunities: deletedOpportunity.id } }
  );

  res.status(204).json(new ApiResponse(204, deletedOpportunity));
});

// Artist Specific

const getArtistOpps = catchAsync(async (req, res) => {
  const artistOpps = await Opportunity.find({});

  res.status(200).json(new ApiResponse(200, artistOpps));
});

const getArtistOpp = catchAsync(async (req, res) => {
  const { id } = req.params;

  const artistOpp = await Opportunity.findById(id);

  if(artistOpp.isBlocked){
    throw new ApiError("This opportunity is blocked")
  }

  res.status(200).json(new ApiResponse(200, artistOpp));
});

export default { createPatronOpportunity, getPatronOpportunity, updatePatronOpportunity, deletePatronOpportunity, getPatronOpps, getArtistOpps, getArtistOpp };

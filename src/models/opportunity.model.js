import mongoose, { Schema } from "mongoose";

import { AvailableMediaType, AvailableOpportunityTimeSlot } from "../constants.js";
import Application from "./application.model.js";

const opportunitySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    purpose: {
      type: String,
      trim: true,
      required: [true, "Please provide a purpose"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Please provide a description"],
    },
    location: {
      type: String,
      trim: true,
      required: [true, "Please provide a location"],
    },
    languages: {
      type: String,
      trim: true,
      required: [true, "Please provide languages"],
    },
    budget: {
      type: Number,
      min: [1, "Budget cannot be zero or less than zero"],
      required: [true, "Please provide a budget"],
    },
    performanceDate: {
      type: Date,
      trim: true,
      required: [true, "Please provide a performanceDate"],
    },
    startTime :{
        type: String,
        // required: [true, "Please provide a startTime"],
    },
    performanceDuration: {
      type: String,
      trim: true,
      // required: [true, "Please provide a performanceDuration"],
    },
    applicationPeriod: {
      start: {
        type: Date,
        default: Date.now(),
      },
      end: {
        type: Date,
        trim: true,
        required: [true, "Please provide an endDate"],
      },
    },
    artType: {
      type: String,
      trim: true,
      // required: [true, "Please provide a artType"],
    },
    artCategory: {
      type: String,
      trim: true,
      // required: [true, "Please provide a artCategory"],
    },
    artName: {
      type: String,
      trim: true,
      // required: [true, "Please provide a artName"],
    },
    theme: {
      type: String,
      trim: true,
      // required: [true, "Please provide a theme"],
    },
    mediaType: {
      type: String,
      trim: true,
      enum: {
        values: AvailableMediaType,
        message: "Please provide a valid mediaType",
      },
      // required: [true, "Please provide a mediaType"],
    },
    customization: {
      type: String,
      trim: true,
      // required: [true, "Please provide a customization"],
    },
    requiredArtists: {
      type: Number,
      min: [1, "requiredArtists cannot be zero or less than zero"],
      // required: [true, "Please provide an requiredArtists"],
    },
    artistLevel: {
      type: String,
      trim: true,
      // required: [true, "Please provide an artistLevel"],
    },
    artistLocation: {
      type: String,
      trim: true,
      // required: [true, "Please provide an artistLocation"],
    },
    audienceSize: {
      type: String,
      trim: true,
      // required: [true, "Please provide an audienceSize"],
    },
    audienceProfile: {
      type: String,
      trim: true,
      // required: [true, "Please provide an audienceProfile"],
    },
    venue: {
      type: String,
      trim: true,
      // required: [true, "Please provide an venue"],
    },
    facilities: {
      type: String,
      trim: true,
      // required: [true, "Please provide an facilities"],
    },
    otherRequirements: {
      type: String,
      trim: true,
    },
    contactPersonName: {
      type: String,
      trim: true,
      // required: [true, "Please provide an contactPersonName"],
    },
    contactPersonNumber: {
      type: String,
      trim: true,
      // required: [true, "Please provide an contactPersonNumber"],
    },
    contactEmail: {
      type: String,
      trim: true,
      // required: [true, "Please provide an contactEmail"],
    },
    active: {
      type: Boolean,
      default: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

opportunitySchema.virtual("totalApplicants", {
  ref: "Application",
  localField: "_id",
  foreignField: "opportunity",
  count: true,
});

opportunitySchema.pre(/^find/, async function (next) {
  if (this.options && this.options.includeAll) {
    this.populate("totalApplicants");
    return next();
  }

  await this.model.updateMany(
    {
      active: { $ne: false },
      "applicationPeriod.end": {
        $lt: new Date(),
      },
    },
    { $set: { active: false } }
  );

  this.where({
    active: { $eq: true },
  });

  next();
});

opportunitySchema.methods.deleteOpportunity = async function (id) {
  const deletedOpportunity = await this.model("Opportunity").findByIdAndDelete(id);

  await Application.deleteMany({ opportunityId: deletedOpportunity._id });

  // await SaveOpportunity.deleteMany({ opportunityId: deletedOpportunity._id });

  // return deletedOpportunity;
};

const Opportunity = mongoose.model("Opportunity", opportunitySchema);

export default Opportunity;

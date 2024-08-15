import mongoose, { Schema } from "mongoose";
import { AvailableApplicationStatus } from "../constants.js";

const applicationSchema = new Schema({
  appliedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  opportunity: {
    type: Schema.Types.ObjectId,
    ref: "Opportunity",
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    trim: true,
    default: "Applied",
    enum: {
      values: AvailableApplicationStatus,
      message: "Please provide a valid status",
    },
  },
  appliedOn: {
    type: Date,
    default: Date.now(),
  },
  answer: {
    type: String,
    trim: true,
  },
  quotedPrice: Number,
});

const Application = mongoose.model("Application", applicationSchema);

export default Application;

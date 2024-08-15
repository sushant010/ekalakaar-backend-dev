import mongoose, { Schema } from "mongoose";

const commonStringConstraints = {
  type: String,
  trim: true,
  default: "",
};

const profileSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  personalInfo: {
    profession: commonStringConstraints,
    companyName: commonStringConstraints,
    authorizedPerson: commonStringConstraints,
    designation: commonStringConstraints,
    companyDescription: commonStringConstraints,
  },
});

const PatronProfile = mongoose.model("PatronProfile", profileSchema);

export default PatronProfile;

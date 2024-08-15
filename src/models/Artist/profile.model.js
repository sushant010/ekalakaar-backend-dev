import mongoose, { Schema } from "mongoose";
import { AvailableUserGender } from "../../constants.js";
import { validateMaxArraySize } from "../../utils/helpers.js";

const commonStringConstraints = {
  type: String,
  trim: true,
  default: "",
};

const commonNumberConstraints = {
  type: Number,
  default: "",
};

const commonDateConstraints = { type: Date, default: "" };

const profileSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    //personalInfo
    personalInfo: {
      about: commonStringConstraints,
      age: { ...commonNumberConstraints },
      gender: {
        ...commonStringConstraints,
        enum: {
          values: AvailableUserGender,
          message: "Please provide a valid gender",
        },
      },
      incomeSrc: commonStringConstraints,
      socialCategory: commonStringConstraints,
      pwd: commonStringConstraints,
      languages: [commonStringConstraints],
      annualIncome: commonStringConstraints,
    },

    //OTHERINFO
    otherInfo: {
      primaryIncomeSrc: commonStringConstraints,
      anunalIncomeByPerf: commonStringConstraints,
      idProof: {
        name: commonStringConstraints,
        num: commonStringConstraints,
      },
      gstIn: commonStringConstraints,
      passportNumber: {
        number: commonStringConstraints,
        expirationMonth: commonStringConstraints,
        expirationYear: commonStringConstraints,
      },
      panNumber: commonStringConstraints,
      upiId: commonStringConstraints,
      profileUrl: commonStringConstraints,
      highestEducation: commonStringConstraints,
      yearOfCompletion: commonNumberConstraints,
      bankAccountNumber: commonStringConstraints,
      bankName: commonStringConstraints,
      ifscCode: commonStringConstraints,
      bankBranchLocation: commonStringConstraints,
    },

     //artinfo
    artInfo: {
      aboutArt: commonStringConstraints,
      artCategory: [commonStringConstraints],
      artName: [commonStringConstraints],
      artType: [commonStringConstraints],
      artEducation: commonStringConstraints,
      artDocuments: [commonStringConstraints],
    },

    //traditionalinfo
    traditionalInfo: [
      {
        artName: commonStringConstraints,
        guruName: commonStringConstraints,
        location: commonStringConstraints,
        duration: commonStringConstraints,
        completionYear: commonNumberConstraints,
        documentUrl: commonStringConstraints,
        _id: false,
      },
    ],

    //professionalinfo
    professionalInfo: [
      {
        course: commonStringConstraints,
        specialization: commonStringConstraints,
        institute: commonStringConstraints,
        duration: commonStringConstraints,
        completionYear: commonNumberConstraints,
        documentUrl: commonStringConstraints,
        _id: false,
      },
    ],


    //performanceinfo
    performanceInfo: {
      performanceDocuments: [commonStringConstraints],

      performances: [
        {
          nameOfArts: commonStringConstraints,
          totalNoOfArtists: commonNumberConstraints,
          existingProductions: {
            type: Boolean,
            default: false,
          },
          nameOfProductions: commonStringConstraints,
          briefOfPerformance: commonStringConstraints,
          approxBudget: commonNumberConstraints,
          samples: [commonStringConstraints],
          productionVideos: [commonStringConstraints],
          productionImages:[commonStringConstraints],
          durationOfProgram:commonStringConstraints,
          nameOfArtists:commonStringConstraints,
          majorPerformanceCity:commonStringConstraints,
          anyFurtherDetails:commonStringConstraints,
          _id: false,
        },
      ],
     
     
      perfType: commonStringConstraints,
      experience: commonStringConstraints,
      highestPerfLevel: commonStringConstraints,
      affiliation: {
        isAffiliated: {
          type: Boolean,
          default: false,
        },
        name: commonStringConstraints,
        location: commonStringConstraints,
        contactNumber: {
          countryCode: {
            type: String,
            trim: true,
            default: "",
          },
          number: {
            type: String,
            trim: true,
            default: "",
            match: [/^\+?(\d{1,4})?[\s(-]?\(?(\d{3})\)?[-\s]?(\d{3})[-\s]?(\d{4})$/, "Please provide a valid phoneNumber"],
          },
        },
      },
      perfDetails: [
        {
          eventName: commonStringConstraints,
          // duration: commonStringConstraints,
          monthyear:{
              eventMonth: commonStringConstraints,
              eventYear: commonStringConstraints,
          },
          level: commonStringConstraints,
          location: commonStringConstraints,
          collaborator: commonStringConstraints,
          link: commonStringConstraints,
          _id: false,
        },
      ],
      highlights: commonStringConstraints,
      totalPerfs: commonNumberConstraints,
      peakPerf: commonStringConstraints,
      perfDuration: {
        india: commonStringConstraints,
        international: commonStringConstraints,
      },
      perfCharge: {
        india: commonStringConstraints,
        international: commonStringConstraints,
      },
      majorPerfCities: [commonStringConstraints],
      majorPerfCountry: [commonStringConstraints],
      perfImgs: [commonStringConstraints],
      perfVideos: [commonStringConstraints],
    },


    //awardInfo
    awardsInfo: {
      totalAwards: commonNumberConstraints,
      level: commonStringConstraints,
      awardDocuments: [commonStringConstraints],
      awardsDetails: [
        {
          title: commonStringConstraints,
          awardingBody: commonStringConstraints,
          level: commonStringConstraints,
          location: commonStringConstraints,
          year: commonStringConstraints,
          documentUrl: commonStringConstraints,
          _id: false,
        },
      ],
      highlights: commonStringConstraints,
    },
  },
  {
    validateBeforeSave: false,
    validateModifiedOnly: true,
  }
);

profileSchema.path("performanceInfo.perfDetails").validate((perfDetails) => {
  validateMaxArraySize(perfDetails, 4);
}, "perfNames exceeds maximum array size (4)");

const ArtistProfile = mongoose.model("ArtistProfile", profileSchema);

export default ArtistProfile;
